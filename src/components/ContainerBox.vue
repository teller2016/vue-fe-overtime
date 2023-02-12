<template>
  <div class="sb__container">
    <!-- 옵션 영역 -->
    <div class="container__box">
      <div class="sb__options">
        <OptionBox headerTitle="날짜설정"></OptionBox>
        <OptionBox headerTitle="일지 등록"></OptionBox>
        <OptionBox headerTitle="석식 등록"></OptionBox>
      </div>
    </div>

    <!-- HTML 영역 -->
    <div class="container__box">
      결과
    </div>
  </div>
</template>

<script>
import OptionBox from './OptionBox.vue';
export default {
  components: {
    OptionBox,
  }
}
</script>

<style lang="scss" scoped>
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
  }
}
</style>