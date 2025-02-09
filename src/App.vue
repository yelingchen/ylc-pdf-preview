<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="box">
    <RouterView />
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

.box {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
