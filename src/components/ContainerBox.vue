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

          <div class="option__content">
            <div class="sb__dinner">
              <form class="dinner__form" @submit.prevent="addDinnerData">
                <!-- 날짜 -->
                <label class="dinner__date">
                  <input type="date" v-model="dinnerDate" />
                </label>

                <!-- 석식 텍스트 입력 -->
                <label class="dinner__text">
                  <input
                    type="text"
                    v-model="dinnerText"
                    placeholder="ex. 석식대(마이쥬스)"
                  />
                </label>

                <!-- 추가버튼 -->
                <ButtonElement
                  type="submit"
                  class="dinner__button"
                  size="m"
                  line="black"
                  >추가</ButtonElement
                >
              </form>

              <div class="dinner__result" v-if="dinnerList.length">
                <h3 class="dinner__result__title">석식 결과</h3>

                <table class="dinner__result__table">
                  <colgroup>
                    <col width="100" />
                    <col width="200" />
                    <col width="160" />
                  </colgroup>

                  <tr
                    class="dinner__result__row"
                    v-for="(data, index) in dinnerList"
                    :key="index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>
                      {{ `${data.year % 100}.${data.month}.${data.day}` }}
                    </td>
                    <td>{{ data.text }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HTML 영역 -->
    <div class="container__box">결과</div>
  </div>
</template>

<script>
import { ref, watchEffect, onMounted } from "vue";
import SelectElement from "./elements/SelectElement.vue";
import DragDrop from "./DragDrop.vue";
import NotificationPopup from "./utils/NotificationPopup.vue";
import ButtonElement from "./elements/ButtonElement.vue";
export default {
  components: {
    SelectElement,
    DragDrop,
    NotificationPopup,
    ButtonElement,
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

    // 석식 데이터
    const dinnerData = ref({});
    const dinnerDate = ref("");
    const dinnerText = ref("");
    const dinnerList = ref([]);

    watchEffect(() => {
      const unsortedData = [];

      for (let data in dinnerData.value) {
        unsortedData.push({
          date: data,
          text: dinnerData.value[data],
        });
      }

      // 날짜순으로 정렬
      const sortedData = unsortedData.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      // 년,월,일 분리된 데이터
      const dateDataList = sortedData.map((item) => {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return {
          date: item.date,
          year,
          month,
          day,
          text: item.text,
        };
      });

      console.log(dateDataList);

      dinnerList.value = dateDataList;
    });

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

    // 석식 데이터 추가 버튼이벤트
    const addDinnerData = () => {
      if (!dinnerDate.value) {
        alert("날짜를 선택해주세요.");
        return;
      }

      dinnerData.value[dinnerDate.value] = dinnerText.value;
    };

    return {
      years,
      workStartTime,
      updateYearValue,
      updateWorkStartTimeValue,
      addDinnerData,
      dinnerDate,
      dinnerText,
      dinnerData,
      dinnerList,
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

  &__dinner {
    .dinner {
      &__form {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      &__date {
        flex-shrink: 0;
        width: 140px;
        input {
          width: 100%;
        }
      }

      &__text {
        flex: 1;
      }

      &__submit {
        flex-shrink: 0;
      }

      &__result {
        margin-top: 24px;

        &__title {
          font-weight: 600;
          font-size: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid black;
        }

        &__table {
          border-collapse: collapse;
        }

        &__row {
          td {
            padding: 4px;
            font-size: 20px;
          }

          &:not(:first-of-type) {
            border-top: 1px solid $gray100;
          }
        }
      }
    }
  }
}
</style>
