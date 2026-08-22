---
title: 纯静态 Markdown Negotiation
description: 基于 Cloudflare Rules，纯静态实现 Markdown Negotiation。
date: 2026-08-02
tag:
  - Blog
  - Web
---

支持 Markdown Negotiation 网站可以直接给 AI Agent 提供 Markdown 内容。

Markdown Negotiation 复用了服务器的
[Content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation)
机制。这个机制允许浏览器在
[Accept header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept)
中描述用户的首选内容，从而像浏览器返回不同结果的内容。

![Server-driven content negotiation image from mdn](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation/httpnegoserver.png)

Markdown Negotiation 就是在首选内容为 Markdown 时返回 Markdown。

Cloudflare 在 2026 年 2 月份推出了
[Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/)，通过这个功能可以一键让网站
Markdown Negotiation。但是这个功能需要 Cloudflare Business 订阅。

[Hacknet.wiki](https://hacknet.wiki) 已经支持了
[llms.txt](https://llmstxt.org/)，所用的插件已经自动给每个页面创建了 markdown
版本并在 llms.txt 中引用，这样 AI Agent 可以直接找到 Markdown
版本的文档。它部署在 Cloudflare Page 上。利用 Cloudflare Worker 实现 Markdown
Negotiation，但那就不算纯静态了。利用不对请求限制的 Cloudflare Rules
更具有挑战性。

## Markdown Negotiation 流程与实现思路

其实 Markdown Negotiation 的流程很简单，HTTP 请求带上 `Accept: text/markdown`
的时候返回对应 Markdown 即可。

在 vitepress 开启了 Clean URLs 功能，安装了
[vitepress-plugin-llms](https://npmx.dev/package/vitepress-plugin-llms)
情况下，规则如下:

- `/` -> `/index.md`
- `/foo` -> `/foo.md`
- `/foo/bar` `/foo/bar.md`
- `/foo/` -> `/foo.md`

因为使用了 CDN，需要给 CDN 开启 Vary 功能。源站通过响应头 `Vary: Accept` 让 CDN
为那个资源根据不同 `Accept` 请求头缓存相应资源。那么所有页面路径都需要返回
`Vary: Accept`。

不过这样的话，攻击者可以制造不同 `Accept`
头绕过缓存给源站发起攻击。如果源站脆弱需要对 `Accept` 进行归一化处理。显然
Cloudflare Page 不需要担心这个，但由于用到了 EdgeOne，它没对 `Accept`
请求头做归一化，所有可以简单重写一下源站请求头来提升 CDN 效率：

- `text/markdown*` -> `text/markdown`
- 其他 -> `*/*`

## 实现

### Cloudflare Page

在 `_header` 中自定义响应头。

```
/*
  Vary: Accept

/*.md
  Content-Type: text/markdown; charset=utf-8
```

### Cloudflare Rules

#### Cache Rules

创建一个 Cache Rules 为站点启用 Vary 归一化。

#### URL Rewrite Rules

创建三个 URL Rewrite Rules，内容与顺序如下。

1. `/` -> `/index.md`。

- Custom filter expression ：

```
(any(http.request.headers["accept"][*] contains "text/markdown") and http.request.uri.path eq "/")
```

- Path - Rewrite to... `Static` : `/index.md`

2.`/foo/` -> `/foo.md`。硬编码所有目录。

- Custom filter expression:

```
(any(http.request.headers["accept"][*] contains "text/markdown") and (http.request.uri.path wildcard "/reference/" or http.request.uri.path wildcard "/extension-tutorial/"))
```

- Path - Rewrite to... `Dynamic` :
  `concat(substring(http.request.uri.path, 0, -1), ".md")`

3. `/foo` -> `/foo.md` & `/foo/bar` `/foo/bar.md`。由于正则功能需要 WAF
   订阅，硬编码常用后缀名来排除文件。

- Custom filter expression:

```
(any(http.request.headers["accept"][*] contains "text/markdown") and not ends_with(http.request.uri.path, "/") and not ends_with(http.request.uri.path, ".md") and not ends_with(http.request.uri.path, ".txt") and not ends_with(http.request.uri.path, ".xml") and not ends_with(http.request.uri.path, ".html") and not ends_with(http.request.uri.path, ".htm") and not ends_with(http.request.uri.path, ".json") and not ends_with(http.request.uri.path, ".js") and not ends_with(http.request.uri.path, ".mjs") and not ends_with(http.request.uri.path, ".css") and not ends_with(http.request.uri.path, ".svg") and not ends_with(http.request.uri.path, ".png") and not ends_with(http.request.uri.path, ".jpeg") and not ends_with(http.request.uri.path, ".jpg") and not ends_with(http.request.uri.path, ".gif") and not ends_with(http.request.uri.path, ".webp") and not ends_with(http.request.uri.path, ".ico") and not ends_with(http.request.uri.path, ".woff2") and not ends_with(http.request.uri.path, ".woff") and not ends_with(http.request.uri.path, ".ttf") and not ends_with(http.request.uri.path, ".eot") and not ends_with(http.request.uri.path, ".map"))
```

- Path - Rewrite to... `Dynamic` : `concat(http.request.uri.path, ".md")`

#### EdgeOne 规则

在 **站点加速 - 规则引擎** 下创建规则

IF

- HOST 等于 `hacknet.wiki`
- HTTP 请求头 `Accept` 正则匹配 `text/markdown*`
- Vary 特性 `开启`
- 修改 HTTP 回源请求头 类型：设置 头部名称：`Accept` 头部值：`text/markdown`
