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
          <header class="option__header">
            일지등록
            <NotificationPopup>
              <p class="sb__guide__text">
                * 작성하려는 월의 일지를 <em>Excel 파일</em>로 받아서
                등록해주세요.
              </p>
              <figure class="sb__guide__img">
                <img src="../assets/images/excel_download_guide.png" alt="" />
              </figure>
            </NotificationPopup>
          </header>

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
import { ref, onMounted } from "vue";
import SelectElement from "./elements/SelectElement.vue";
import DragDrop from "./DragDrop.vue";
import NotificationPopup from "./utils/NotificationPopup.vue";
export default {
  components: {
    SelectElement,
    DragDrop,
    NotificationPopup,
  },
  setup() {
    // 년도 데이터 목록
    const years = ref([]);
    // 출근시간 데이터 목록
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

    onMounted(() => {
      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const yearValue = year % 100;
      const yearList = [];

      yearList.push({
        text: year - 1,
        value: yearValue - 1,
        selected: false,
      });
      yearList.push({
        text: year,
        value: yearValue,
        selected: true,
      });
      yearList.push({
        text: year + 1,
        value: yearValue + 1,
        selected: false,
      });

      years.value = [...yearList];
    });

    // 년도 선택시
    const updateYearValue = (value) => {
      console.log(value);
    };

    // 출근시간 선택시
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

  &__guide {
    &__text {
      color: black;
      font-weight: bold;
      font-size: 16px;

      em {
        color: red;
      }
    }

    &__img {
      display: block;
      width: 1500px;
      margin-top: 8px;

      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
}
</style>
