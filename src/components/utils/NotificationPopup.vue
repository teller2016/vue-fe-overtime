<template>
  <div class="sb__notiPopup">
    <span
      class="notiPopup__icon"
      @mouseover="togglePopup(true)"
      @mouseleave="togglePopup(false)"
    >
      ?
    </span>

    <transition name="fade">
      <div v-if="showPopup" class="notiPopup__wrapper">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const showPopup = ref(false);

    const togglePopup = (show) => {
      showPopup.value = show;
    };

    return {
      showPopup,
      togglePopup,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  &__notiPopup {
    display: inline-block;
    position: relative;
    z-index: 1;

    &:hover {
      .notiPopup {
        &__icon {
          scale: 1.1;
        }
      }
    }
    .notiPopup {
      &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 23px;
        height: 23px;
        border: 2px solid orange;
        color: orange;
        font-size: 20px;
        border-radius: 50%;
        transition: all 0.5s ease;
      }

      &__wrapper {
        position: absolute;
        left: 50%;
        top: 100%;
        transform: translateX(-50%);
        padding: 8px;
        background: #f8f8f8;
        border: 1px solid #ddd;
        border-radius: 16px;
        font-size: 0;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
