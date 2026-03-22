<template>
  <div class="sb__notiPopup">
    <span class="notiPopup__icon" @mouseover="togglePopup(true)" @mouseleave="togglePopup(false)"> ? </span>

    <transition name="fade">
      <div v-if="showPopup" class="notiPopup__wrapper">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
  import { ref } from 'vue';
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
          width: 26px;
          height: 26px;
          border: 2px solid $accent-primary;
          color: $accent-primary;
          font-size: 14px;
          font-weight: 600;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        &__wrapper {
          position: absolute;
          left: 0;
          top: 100%;
          transform: translateX(-10%);
          padding: 12px;
          background: $dark-surface;
          border: 1px solid $dark-border;
          border-radius: 12px;
          font-size: 0;
          white-space: nowrap;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
</style>
