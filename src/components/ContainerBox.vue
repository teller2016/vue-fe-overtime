<template>
  <div class="sb__container">
    <!-- 옵션 영역 -->
    <div class="container__box">
      <div class="sb__options">
        <div class="sb__option">
          <header class="option__header">날짜설정</header>

          <div class="option__content">
            <SelectElement
              selectTitle="년도"
              selectName="year"
              :items="years"
              @update-value="updateYearValue"
            >
            </SelectElement>

            <SelectElement
              selectTitle="출근시간"
              selectName="start-tiem"
              :items="workStartTime"
              @update-value="updateWorkStartTimeValue"
            >
            </SelectElement>
          </div>
        </div>

        <div class="sb__option">
          <header class="option__header">일지등록</header>

          <div class="option__content">
            <p class="sb__options__guide">
              해당 월의 일지 excel파일을 불러와 주세요.
            </p>
            <DragDrop />
          </div>
        </div>

        <div class="sb__option">
          <header class="option__header">석식등록</header>

          <div class="option__content"></div>
        </div>
      </div>
    </div>

    <!-- HTML 영역 -->
    <div class="container__box">결과</div>
  </div>
</template>

<script>
// import { ref } from "vue";
import SelectElement from "./elements/SelectElement.vue";
import DragDrop from "./DragDrop.vue";
export default {
  components: {
    SelectElement,
    DragDrop,
  },
  setup() {
    const years = [
      {
        text: "22",
        value: 22,
        selected: false,
      },
      {
        text: "23",
        value: 23,
        selected: true,
      },
      {
        text: "24",
        value: 24,
        selected: false,
      },
    ];

    const workStartTime = [
      {
        text: "9",
        value: 18,
        selected: false,
      },
      {
        text: "9:30",
        value: 18.5,
        selected: true,
      },
      {
        text: "10:00",
        value: 19,
        selected: false,
      },
    ];

    const updateYearValue = (value) => {
      console.log(value);
    };

    const updateWorkStartTimeValue = (value) => {
      console.log(value);
    };

    return {
      years,
      workStartTime,
      updateYearValue,
      updateWorkStartTimeValue,
    };
  },
};
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

    &__guide {
      margin-bottom: 8px;
      color: $red;
      font-size: 13px;
    }
  }

  &__option {
    width: 100%;
    padding: 16px;

    &:not(:first-of-type) {
      border-left: 1px solid black;
    }
    .option {
      &__header {
        margin-bottom: 12px;
        font-weight: 700;
        font-size: 24px;
        text-align: left;
      }

      &__content {
      }
    }
  }
}
</style>
