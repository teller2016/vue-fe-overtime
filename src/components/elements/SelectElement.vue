<template>
  <div class="sb__select">
    <span class="select__title">{{ selectTitle }}</span>
    <select
      :name="selectName"
      id=""
      class="select__element"
      @input="updateValue($event.target.value)"
    >
      <option
        v-for="(item, index) in items"
        :value="item.value"
        :key="index"
        :selected="item.selected"
      >
        {{ item.text }}
      </option>
      <slot></slot>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    selectTitle: String,
    selectName: String,
    items: Array,
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const updateValue = (value) => {
      context.emit("update:modelValue", value);
    };

    return {
      updateValue,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  &__select {
    overflow: hidden;
    display: inline-flex;
    align-items: stretch;
    flex-wrap: nowrap;
    width: 100%;
    border: 1px solid $gray100;
    border-radius: 8px;

    &:not(:first-of-type) {
      margin-top: 8px;
    }

    select {
      flex-grow: 1;
      border: none;
      padding: 0 12px;
    }

    .select {
      &__title {
        flex-grow: 0;
        padding: 8px 12px;
        background: $gray50;
        border-right: 1px solid $gray100;
      }

      &__element {
      }
    }
  }
}
</style>
