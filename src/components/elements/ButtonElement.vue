<template>
  <button
    class="sb__button"
    :class="[
      size === 's' ? 'btn-s' : '',
      size === 'm' ? 'btn-m' : '',
      size === 'lg' ? 'btn-lg' : '',
      line === 'black' ? 'btn-black-line' : '',
      line === 'orange' ? 'btn-orange-line' : '',
      line === 'red' ? 'btn-red-line' : '',
    ]"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    size: String,
    line: String,
  },
  emits: ["on-click"],
  setup(props, context) {
    const onClick = (value) => {
      context.emit("on-click", value);
    };

    return {
      onClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  &__button {
    padding: 0 16px;
    border: 1px solid black;
    border-radius: 4px;
    white-space: nowrap;

    &.btn-s {
      height: 28px;
      font-size: 12px;
    }
    &.btn-m {
      height: 40px;
      font-weight: 500;
      font-size: 14px;
    }
    &.btn-lg {
      height: 45px;
      font-weight: bold;
      font-size: 16px;
    }

    &.btn-black-line {
      border-color: black;
      &:hover {
        background: $gray50;
      }
    }
    &.btn-orange-line {
      color: rgb(255, 166, 0);
      border-color: orange;
      &:hover {
        background: rgba(255, 166, 0, 0.1);
      }
    }

    &.btn-red-line {
      color: rgb(255, 0, 0);
      border-color: rgb(255, 0, 0);
      &:hover {
        background: rgba(255, 0, 0, 0.1);
      }
    }
  }
}
</style>
