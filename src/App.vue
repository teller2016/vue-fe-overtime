<template>
  <div @drop.prevent>
    <!-- header -->

    <!-- container -->
    <ContainerBox />
  </div>
</template>

<script>
import { onMounted, onUnmounted } from "vue";
import ContainerBox from "./components/ContainerBox.vue";

export default {
  name: "App",
  components: {
    ContainerBox,
  },
  setup() {
    const onDrop = (event) => {
      event.preventDefault();
    };

    onMounted(() => {
      window.addEventListener("dragenter", onDrop);
      window.addEventListener("dragover", onDrop);
      window.addEventListener("dragleave", onDrop);
      window.addEventListener("drop", onDrop);
    });

    onUnmounted(() => {
      window.removeEventListener("dragenter", onDrop);
      window.removeEventListener("dragover", onDrop);
      window.removeEventListener("dragleave", onDrop);
      window.removeEventListener("drop", onDrop);
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
