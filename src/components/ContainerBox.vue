<template>
  <div class="sb__container">
    <!-- 옵션 영역 -->
    <div class="container__box">
      <div class="sb__options">
        <OptionBox headerTitle="날짜설정">

          <SelectElement selectTitle="년도" selectName="year">
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
          </SelectElement>

          <SelectElement selectTitle="출근시간" selectName="start-time">
            <option value="18">9</option>
            <option value="18.5" selected="">9:30</option>
            <option value="19">10:00</option>
          </SelectElement>
          
        </OptionBox>
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
import SelectElement from './elements/SelectElement.vue';
import OptionBox from './OptionBox.vue';
export default {
  components: {
    OptionBox,
    SelectElement,
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