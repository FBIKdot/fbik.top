---
title: 迁移到 VitePress
description: 再次更换 SSG，哈哈。
date: 2026-08-16
---

在 Hacknet.wiki 长期使用 VitePress 构建站点之后，我越来越觉得它顺手。

反观之前用的 [Lume](https://lume.land/)，随着使用深入，不少痛点也逐渐暴露出来：

- Lume 本身通过 CDN 加载，之前走 `lume.land`，被弃用后换到 `cdn.jsdelivr.net`。虽然这么做可以把包拆的很细，但隔一段时间重启项目，可能就要重新从 CDN 拉取一遍依赖，既耗时又烦人。

- Lume 的插件式组装确实自由，可自由往往意味着要自己搭积木。相比之下，VitePress 内置了文档站点所需的大部分常用功能，开箱即用，体验非常连贯。

- Lume 是传统的多页应用，在页面切换和交互流畅度上，逊于 VitePress 的混合渲染（SSG + SPA 导航）。

- VitePress 的扩展机制足够轻量，稍加定制就能满足我的需求，而且上手难度不高。

- 我在用 pnpm，我也一直保持 Hacknet.wiki 在用最新的 VitePress 版本。

干脆花了点时间迁移到了 VitePress。过程比预想中顺利。
