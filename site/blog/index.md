# blog

<script setup>
import { data as posts } from "../.vitepress/blog.data";
</script>

My Blog. Minimalism.

<ul>
  <li v-for="post in posts" :key="post.url">
    {{ post.date }} <a :href="post.url">{{ post.title }}</a>
  </li>
</ul>
