<template>
  <div @drop.prevent>
    <!-- header -->
    <NavigationBar />
    <router-view />
  </div>
</template>

<script>
import { onMounted, onUnmounted } from "vue";
import NavigationBar from "./components/NavigationBar.vue";

export default {
  name: "App",
  components: {
    NavigationBar,
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

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.sb {
  &__container {
    .container {
      &__box {
        border: 1px solid black;
      }
    }
  }

  &__options {
    display: flex;
    align-items: stretch;
    justify-content: center;

    &__guide {
      margin-bottom: 8px;
      color: $red;
      font-size: 13px;
    }
  }

  &__option {
    width: 100%;
    padding: 16px;

    &:not(:first-of-type) {
      border-left: 1px solid black;
    }
    .option {
      &__header {
        margin-bottom: 12px;
        font-weight: 700;
        font-size: 24px;
        text-align: left;
      }

      &__content {
      }
    }
  }

  &__guide {
    &__text {
      color: black;
      font-weight: bold;
      font-size: 16px;

      em {
        color: red;
      }
    }

    &__img {
      display: block;
      width: 1500px;
      margin-top: 8px;

      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
}
</style>
