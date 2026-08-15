# Tags

<script setup>
import { data as posts } from "../.vitepress/blog.data";

// 标签及文章数，按文章数降序、名称升序排列
const tags = (() => {
  const count = new Map();
  for (const post of posts) {
    for (const tag of post.tags) {
      count.set(tag, (count.get(tag) ?? 0) + 1);
    }
  }
  return [...count.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );
})();
</script>

<ul>
  <li v-for="[tag, n] in tags" :key="tag">
    <a :href="`/blog/tags/${encodeURIComponent(tag)}`">{{ tag }}</a>
    ({{ n }})
  </li>
</ul>
