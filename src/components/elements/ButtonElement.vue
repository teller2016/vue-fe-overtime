<template>
  <button
    class="sb__button"
    :class="[
      size === 'xxs' ? 'btn-xxs' : '',
      size === 's' ? 'btn-s' : '',
      size === 'm' ? 'btn-m' : '',
      size === 'lg' ? 'btn-lg' : '',
      size === 'xlg' ? 'btn-xlg' : '',
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
    border: 1px solid $dark-border;
    border-radius: 6px;
    white-space: nowrap;
    color: $dark-text;
    transition: all 0.2s;

    &.btn-xxs {
      padding: 0 8px;
      height: 24px;
      font-size: 12px;
    }
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
    &.btn-xlg {
      height: 48px;
      font-weight: bold;
      font-size: 20px;
    }

    &.btn-black-line {
      border-color: $dark-border;
      background: rgba(255, 255, 255, 0.03);
      &:hover {
        background: rgba(255, 255, 255, 0.07);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }
    &.btn-orange-line {
      color: $accent-amber;
      border-color: rgba($accent-amber, 0.25);
      &:hover {
        background: $accent-amber-dim;
      }
    }

    &.btn-red-line {
      color: $accent-rose;
      border-color: rgba($accent-rose, 0.25);
      &:hover {
        background: $accent-rose-dim;
      }
    }
  }
}
</style>
