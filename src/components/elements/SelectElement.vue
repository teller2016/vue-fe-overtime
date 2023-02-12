<template>
  <div class="sb__select">
    <span>{{ selectName }}</span>
    <select name="" id="">
      <option value="">디폴트</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    selectName: String,
  }
}
</script>

<style lang="scss" scoped>
.sb {
  &__select {
    .select {
      &__name {

      }
    }
  }
}
</style>