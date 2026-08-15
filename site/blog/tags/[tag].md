---
lastUpdated: false
---

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";
import { data as posts } from "../../.vitepress/blog.data";

const { page } = useData();
const tag = computed(() => String(page.value.params.tag ?? ""));
const items = computed(() =>
  posts.filter((post) => post.tags.includes(tag.value))
);
</script>

<div class="tag-posts">
  <h1>{{ tag }}</h1>
  <ul>
    <li v-for="post in items" :key="post.url">
      {{ post.date }} <a :href="post.url">{{ post.title }}</a>
    </li>
  </ul>
</div>
