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
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans:wght@400;500;700&display=swap");

html {
  background: $dark-bg;
}

#app {
  font-family: "Noto Sans", "Noto Sans KR", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $dark-text;
  min-height: 100vh;
  background: $dark-bg;
  padding-top: 20px;
}

.sb {
  overflow: overlay;

  &__container {
    .container {
      &__box {
        border-radius: 16px;
        border: 1px solid $dark-border;
        background: $dark-card;
      }
    }
  }

  &__options {
    display: flex;
    align-items: stretch;
    justify-content: center;

    &__guide {
      margin-bottom: 8px;
      color: $dark-text;
      font-size: 13px;

      em {
        font-weight: 700;
        color: $accent-primary;
      }
    }
  }

  &__option {
    width: 100%;
    padding: 16px;

    &:not(:first-of-type) {
      border-left: 1px solid $dark-border;
    }
    .option {
      &__header {
        margin-bottom: 12px;
        font-weight: 700;
        font-size: 24px;
        text-align: left;
        color: $dark-text;
      }

      &__content {
      }
    }
  }

  &__guide {
    &__text {
      color: $dark-text;
      font-weight: bold;
      font-size: 16px;

      em {
        color: $accent-primary;
      }
    }

    &__img {
      display: block;
      margin-top: 8px;
    }
  }
}
</style>
