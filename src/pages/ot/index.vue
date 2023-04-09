<template>
  <div class="sb__container">
    <a href="https://fe-overtime.netlify.app/" class="sb__tempLink"
      >현재 미완성입니다. 클릭하여 동작 페이지로 이동</a
    >

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
              v-model="workYear"
            >
            </SelectElement>

            <SelectElement
              selectTitle="출근시간"
              selectName="start-tiem"
              :items="workStartTimeList"
              v-model="workStartTime"
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
                <img
                  src="../../assets/images/excel_download_guide.png"
                  alt=""
                />
              </figure>
            </NotificationPopup>
          </header>

          <div class="option__content">
            <p class="sb__options__guide">
              해당 월의 일지 excel파일을 불러와 주세요.
            </p>
            <DragDrop @get-excel-data="getExcelData" />
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

              <div class="dinner__result">
                <h3 class="dinner__result__title">석식 결과</h3>

                <table class="dinner__result__table">
                  <colgroup>
                    <col width="30" />
                    <col width="200" />
                    <col width="160" />
                    <col width="70" />
                  </colgroup>

                  <template v-if="dinnerList.length">
                    <tr
                      class="dinner__result__row"
                      v-for="(data, index) in dinnerList"
                      :key="index"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>
                        {{ data.date }}
                      </td>
                      <td>{{ data.text }}</td>
                      <td>
                        <ButtonElement
                          type="button"
                          class="dinner__delete"
                          size="s"
                          line="red"
                          @on-click="deleteDinnerData(data.date)"
                        >
                          삭제
                        </ButtonElement>
                      </td>
                    </tr>
                  </template>

                  <template v-else>
                    <tr class="dinner__result__row">
                      <td colspan="4">없음</td>
                    </tr>
                  </template>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HTML 영역 -->
    <div class="container__box sb__result">
      <h2 class="result__header">결과</h2>
      <div class="result__btn">
        <ButtonElement type="button" size="xlg" line="black"
          >결과조회</ButtonElement
        >
      </div>
      <div class="result__html">
        <ResultTemplate v-if="Object.keys(workList).length" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect, onMounted } from "vue";
import SelectElement from "@/components/elements/SelectElement.vue";
import DragDrop from "@/components/DragDrop.vue";
import NotificationPopup from "@/components/utils/NotificationPopup.vue";
import ButtonElement from "@/components/elements/ButtonElement.vue";
import ResultTemplate from "@/components/ResultTemplate.vue";
import filterOvertimeExcelData from "@/composables/filterOvertimeExcel";
export default {
  components: {
    SelectElement,
    DragDrop,
    NotificationPopup,
    ButtonElement,
    ResultTemplate,
  },
  setup() {
    // 년도 데이터 목록
    const years = ref([]);
    // 출근시간 데이터 목록
    const workStartTimeList = [
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

    // 일 데이터
    const workList = ref({});
    // 석식
    const dinnerList = ref([]);
    // 년도
    const workYear = ref("");
    // 출근시간
    const workStartTime = ref(workStartTimeList[1].value);

    watchEffect(() => {
      const unsortedData = [];

      for (let data in dinnerData.value) {
        unsortedData.push({
          date: dinnerData.value[data].fullDate,
          text: dinnerData.value[data].dinnerText,
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

      // setting default value
      workYear.value = yearValue;
    });

    // 석식 데이터 추가 버튼이벤트
    const addDinnerData = () => {
      if (!dinnerDate.value) {
        alert("날짜를 선택해주세요.");
        return;
      }

      // dinnerData.value[dinnerDate.value] = dinnerText.value;
      dinnerData.value[dinnerDate.value] = {
        fullDate: dinnerDate.value,
        dinnerText: dinnerText.value,
      };
    };

    const deleteDinnerData = (date) => {
      console.log(date);
      delete dinnerData.value[date];
    };

    // 엑셀데이터 get
    const getExcelData = (data) => {
      workList.value = filterOvertimeExcelData(data);
      console.log(workList.value);
    };

    return {
      years,
      workStartTimeList,
      addDinnerData,
      deleteDinnerData,
      dinnerDate,
      dinnerText,
      dinnerData,
      dinnerList,
      getExcelData,
      workList,
      workYear,
      workStartTime,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  &__tempLink {
    display: inline-block;
    color: red;
    margin-bottom: 14px;
    font-size: 25px;
    &:hover {
      text-decoration: underline;
    }
  }

  &__container {
    max-width: 1920px;
    margin: 0 auto;
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

  &__result {
    padding: 20px;
    .result {
      &__header {
        margin-bottom: 12px;
        font-weight: 700;
        font-size: 36px;
      }

      &__btn {
        text-align: center;
        button {
          width: 200px;
        }
      }

      &__html {
      }
    }
  }
}
</style>
