<script setup lang="ts">
// @ts-ignore
import { computed } from "vue";
// @ts-check
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";

const { frontmatter, site } = useData();

function formatDate(date: unknown): string {
  return date ? String(date).slice(0, 10) : "";
}

function isExternal(url: string): boolean {
  return /^https?:\/\//.test(url);
}

// 当前文章的标签列表（兼容 tag / tags 两种 frontmatter）
const tags = computed<string[]>(() => {
  const value = frontmatter.value.tag ?? frontmatter.value.tags;
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.map((tag) => String(tag));
  return [];
});

interface Author {
  name: string;
  link: string;
}

// 从 frontmatter 提取作者列表；没有 link 或没有作者时，默认链接到本站
const authors = computed<Author[]>(() => {
  const author = frontmatter.value.author;
  if (typeof author === "string") {
    return [{ name: author, link: "/" }];
  }
  if (Array.isArray(author)) {
    const list = author
      .map((item): Author | null => {
        if (typeof item === "string") return { name: item, link: "/" };
        if (item && typeof item === "object") {
          return { name: item.name ?? "", link: item.link || "/" };
        }
        return null;
      })
      .filter((a): a is Author => !!a && !!a.name);
    if (list.length) return list;
  }
  return [{ name: site.value.title, link: "/" }];
});
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <header v-if="frontmatter.date" class="post-meta">
        <h1 class="post-title">{{ frontmatter.title }}</h1>
        <p class="post-date">
          {{ formatDate(frontmatter.date) }} ·
          <template v-for="(author, i) in authors" :key="author.name + i">
            {{ +i > 0 ? ", " : "" }}<a
              :href="author.link"
              :target="isExternal(author.link) ? '_blank' : undefined"
              :rel="isExternal(author.link) ? 'noopener noreferrer' : undefined"
            >{{ author.name }}</a>
          </template>
        </p>
      </header>
    </template>
    <template #doc-footer-before>
      <div v-if="tags.length" class="post-tags">
        <span class="post-tags-label">Tags:</span>
        <a
          v-for="tag in tags"
          :key="tag"
          class="post-tag"
          :href="`/blog/tags/${encodeURIComponent(tag)}`"
        >{{ tag }}</a>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
.post-meta {
  margin-bottom: 16px;
}

.post-title {
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 40px;
  font-size: 28px;
}

@media (min-width: 768px) {
  .post-title {
    font-size: 32px;
  }
}

.post-date {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.post-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
}

.post-tags-label {
  color: var(--vp-c-text-2);
}

.post-tag {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.post-tag:hover {
  color: var(--vp-c-brand-2);
}
</style>

<style>
/* 自定义头部渲染时（有 date 的文章页），隐藏 markdown 中重复的 # 标题 */
.content-container:has(.post-meta) .vp-doc h1:first-child {
  display: none;
}
</style>
