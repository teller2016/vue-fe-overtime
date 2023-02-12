<template>
  <div class="sb__select">
    <span class="select__title">{{ selectTitle }}</span>
    <select :name="selectName" id="" class="select__element">
      <slot></slot>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    selectTitle: String,
    selectName: String,
  }

  // TODO: 년도의 경우 option 생성
}
</script>

<style lang="scss" scoped>
.sb {
  &__select {
    overflow: hidden;
    display: inline-flex;
    align-items: stretch;
    flex-wrap: nowrap;
    width: 100%;
    border: 1px solid black;
    border-radius: 8px;

    select {
      flex-grow: 1;
      border: none;
      padding: 0 12px;
    }

    .select {
      &__title {
        flex-grow: 0;
        padding: 8px 12px;
        background: gray;
        border-right: 1px solid black;
      }

      &__element {
      }

    }
  }
}
</style>