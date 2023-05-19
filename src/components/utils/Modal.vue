<template>
  <div class="sb__modal" v-if="modelValue">
    <div class="modal__box">
      <button class="modal__close" @click="closeModal">닫기</button>
      <header class="modal__header">
        <h3 class="modal__title"><slot name="title"></slot></h3>
      </header>
      <div class="modal__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const closeModal = () => {
      emit("update:modelValue", false);
    };

    return {
      closeModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  &__modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0 0 0 0;
    background: rgba($color: #000000, $alpha: 0.3);

    .modal {
      &__box {
        position: relative;
        min-width: 500px;
        min-height: 100px;
        background: white;
        border-radius: 4px;
      }

      &__close {
        width: 35px;
        height: 35px;
        position: absolute;
        top: 19px;
        right: 14px;
        background-image: url("data:image/svg+xml,%3Csvg fill='%23000000' width='800px' height='800px' viewBox='0 0 256 256' id='Flat' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M202.82861,197.17188a3.99991,3.99991,0,1,1-5.65722,5.65624L128,133.65723,58.82861,202.82812a3.99991,3.99991,0,0,1-5.65722-5.65624L122.343,128,53.17139,58.82812a3.99991,3.99991,0,0,1,5.65722-5.65624L128,122.34277l69.17139-69.17089a3.99991,3.99991,0,0,1,5.65722,5.65624L133.657,128Z'/%3E%3C/svg%3E");
        background-size: 100% auto;
        background-position: center center;
        font-size: 0;
      }

      &__header {
        padding: 16px 24px;
        text-align: left;
        border-bottom: 1px solid $gray100;
      }

      &__title {
        font-size: 28px;
      }

      &__content {
        overflow-y: auto;
        max-height: 80vh;
        padding: 16px 24px;
        text-align: left;
      }
    }
  }
}
</style>
