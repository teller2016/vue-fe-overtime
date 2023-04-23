<template>
  <div class="sb__container">
    <!-- 옵션 영역 -->
    <div class="container__box">
      <div class="sb__options">
        <div class="sb__option">
          <header class="option__header">
            일지등록
            <NotificationPopup>
              <p class="sb__guide__text">
                * 작성하려는 주의 일지를 <em>[개인별 주간] => [엑셀]</em>로
                받아서 등록해주세요.
              </p>
              <figure class="sb__guide__img">
                <img src="../../assets/images/weekAllGuide.png" alt="" />
              </figure>
            </NotificationPopup>
          </header>

          <div class="option__content">
            <p class="sb__options__guide">
              <em>[개인별 주간] => [엑셀]</em> 순으로 Excel파일을 받아, 불러와
              주세요.
            </p>
            <DragDrop @get-excel-data="getExcelData" />
          </div>
        </div>

        <div class="sb__option">
          <header class="option__header">출근시간 설정</header>

          <div class="option__content">
            <dl class="sb__time" v-for="name in nameList" :key="name">
              <!-- 보이기/숨기기 처리 -->

              <dt
                class="time__title"
                :class="{ disabled: nameList.length <= 1 }"
              >
                <label>
                  <input
                    type="checkbox"
                    checked
                    v-model="displayResult[name]"
                  />
                  <span>
                    {{ name }}
                  </span>
                </label>
              </dt>
              <dd class="time__data">
                <SelectElement
                  selectTitle="출근시간"
                  selectName="start-tiem"
                  :items="workStartTimeList"
                  v-model="workEndTimeByName[name]"
                >
                </SelectElement>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <table class="sb__summaryTable" v-if="Object.keys(nameKeyData).length">
      <thead>
        <tr>
          <th></th>
          <th v-for="project in projectList" :key="project">{{ project }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(nameData, name) in nameKeyData"
          :key="name"
          v-show="displayResult[name]"
        >
          <th :class="{ error: nameKeyData[name].summaryTotalData.T !== 40 }">
            {{ name }}
          </th>
          <td v-for="(row, index) in nameData.summaryTableRowData" :key="index">
            {{ row }}
          </td>
        </tr>
      </tbody>
    </table>

    <ul class="sb__result">
      <li
        class="result__item"
        v-for="(nameData, name, index) in nameKeyData"
        :key="name"
        v-show="displayResult[name]"
      >
        <h3 class="result__name">{{ name }}</h3>
        <div class="result__content">
          <!-- 바 차트 -->
          <div
            class="result__chart result__chart--bar"
            v-if="Object.keys(nameData.barChartData).length"
          >
            <Chart
              :data="nameData.barChartData"
              :options="barChartOptions"
              type="bar"
            />
          </div>
          <!-- 도넛 차트 -->
          <div
            class="result__chart result__chart--round"
            v-if="Object.keys(nameData.roundChartData).length"
          >
            <Chart
              :data="nameData.roundChartData"
              :options="roundChartOptions"
              type="round"
            />
          </div>
          <!-- 요약 -->
          <div
            class="result__summary"
            v-if="Object.keys(nameData.summaryData).length"
          >
            <div class="summary__box">
              <h3 class="summary__header">
                요약
                <ButtonElement
                  type="button"
                  class="summary__copy"
                  size="xxs"
                  line="black"
                  @on-click="onCopyText(index)"
                  >복사</ButtonElement
                >
              </h3>

              <div class="summary__content" ref="summaryText">
                <template
                  v-for="(item, index) in nameData.summaryData"
                  :key="index"
                >
                  <dl class="summary__list">
                    <dt class="summary__name">[{{ item.name }}]</dt>
                    <dd class="summary__data" v-if="item.T != 0">
                      T: {{ item.T }}
                    </dd>
                    <dd class="summary__data" v-if="item.OT != 0">
                      OT: {{ item.OT }}
                    </dd>
                  </dl>
                  <br />
                </template>
              </div>
            </div>

            <div class="summary__box">
              <h3 class="summary__header">총합</h3>

              <div class="summary__content">
                <dl class="summary__list">
                  <dd
                    class="summary__error"
                    v-if="nameData.summaryTotalData.T != 40"
                  >
                    *T 전체 합이 40시간이 아닙니다!<br />(연차,휴일 혹은 데이터
                    확인 필요)
                  </dd>
                  <dd class="summary__data">
                    T: {{ nameData.summaryTotalData.T }}
                  </dd>
                  <dd class="summary__data">
                    OT: {{ nameData.summaryTotalData.OT }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Chart from "@/components/utils/Chart.vue";
import SelectElement from "@/components/elements/SelectElement.vue";
import ButtonElement from "@/components/elements/ButtonElement.vue";
import DragDrop from "@/components/DragDrop.vue";
import NotificationPopup from "@/components/utils/NotificationPopup.vue";
import {
  filterWeekAllExcel,
  getProjectList,
} from "@/composables/filterWeekAllExcel";
import getNameList from "@/composables/getNameList";

import {
  convertToBarChartData,
  convertToRoundChartData,
  getSummaryData,
  getSummaryTotalData,
  getSummaryTableRowData,
} from "@/composables/convertToChartData";
import { copyText } from "@/composables/copyText";

export default {
  components: {
    SelectElement,
    DragDrop,
    NotificationPopup,
    Chart,
    ButtonElement,
  },
  setup() {
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
    // 불러온 엑셀데이터
    const excelData = ref("");

    // 이름별 퇴근시간 (이름: 퇴근시간)
    const workEndTimeByName = ref({});

    // 바차트 옵션
    const barChartOptions = ref({
      responsive: true,
      scales: {
        y: {
          stacked: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "요일별 T/OT",
          font: {
            size: 20,
          },
          padding: {
            bottom: 5,
          },
        },
      },
    });

    // 도넛차트 옵션
    const roundChartOptions = ref({
      cutoutPercentage: 85, // 차트의 굵기
      plugins: {
        title: {
          display: true,
          text: "전체 T/OT 합",
          font: {
            size: 20,
          },
          padding: {
            bottom: 5,
          },
        },
      },
    });

    // 이름 리스트
    const nameList = ref([]);
    // 프로젝트 리스트
    const projectList = ref([]);
    // {이름: 데이터}
    const nameKeyData = ref({});
    // 요약 텍스트 영역
    const summaryText = ref(null);

    // 보이기 숨기기 처리
    const displayResult = ref({});

    // 요약된 데이터 셋팅
    const setNameKeyDataByExcelData = (name, filteredExcelData) => {
      const barChartData = convertToBarChartData(filteredExcelData);
      const roundChartData = convertToRoundChartData(filteredExcelData);
      const summaryData = getSummaryData(filteredExcelData);
      const summaryTotalData = getSummaryTotalData(filteredExcelData);

      // table row 데이터 Get
      const summaryTableRowData = getSummaryTableRowData(
        summaryData,
        projectList.value
      );

      nameKeyData.value[name] = {
        filteredExcelData,
        barChartData,
        roundChartData,
        summaryData,
        summaryTotalData,
        summaryTableRowData,
      };
    };

    // 엑셀 데이터 불러오기
    const getExcelData = (data) => {
      excelData.value = data;

      nameList.value = getNameList(data);
      projectList.value = getProjectList(data);

      nameKeyData.value = {}; // 초기화
      for (const [key, name] of Object.entries(nameList.value)) {
        const filteredExcelData = filterWeekAllExcel(
          excelData.value,
          workStartTimeList[1].value, //초기 필터링은 9:30 기준
          name
        );
        setNameKeyDataByExcelData(name, filteredExcelData);
      }
      console.log(nameKeyData.value);
    };

    // 이름별 출근시간 Watch
    watch(
      workEndTimeByName,
      () => {
        if (!excelData.value) return;

        nameKeyData.value = {};

        for (const [key, name] of Object.entries(nameList.value)) {
          const filteredExcelData = filterWeekAllExcel(
            excelData.value,
            workEndTimeByName.value[name],
            name
          );
          setNameKeyDataByExcelData(name, filteredExcelData);
        }

        console.log(nameKeyData.value);
      },
      { deep: true }
    );

    // 이름 리스트 Watch
    watch(nameList, () => {
      const workEndTimeObj = {};
      const displayResultObj = {};

      nameList.value.forEach((name) => {
        workEndTimeObj[name] = workStartTimeList[1].value;
        displayResultObj[name] = true;
      });

      workEndTimeByName.value = workEndTimeObj;
      displayResult.value = displayResultObj;
    });

    // 복사버튼 기능
    const onCopyText = (index) => {
      let textContent = summaryText.value[index].textContent.trim();
      console.log(textContent);

      let count = 0;
      textContent = textContent.replace(/\[/g, (match) => {
        count++;
        return count === 1 ? match : "\n\n[";
      });
      textContent = textContent.replaceAll("] T", "]\nT");
      textContent = textContent.replaceAll(" OT", "\nOT");
      copyText(textContent);
    };

    return {
      nameList,
      projectList,
      workEndTimeByName,
      workStartTimeList,
      getExcelData,
      barChartOptions,
      roundChartOptions,
      onCopyText,
      nameKeyData,
      summaryText,
      displayResult,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  &__summaryTable {
    width: calc(100% - 20px);
    margin-top: 16px;
  }
  .error {
    $errorColor: #ed4555;
    color: $errorColor;
    position: relative;

    &:before {
      content: "*T 확인 필요";
      position: absolute;
      top: 0;
      left: 0;
      color: $errorColor;
      font-size: 12px;
      white-space: nowrap;
    }
  }

  &__container {
    width: 1280px;
    margin: 0 auto;
  }

  &__time {
    display: flex;
    align-items: center;
    &:not(:first-of-type) {
      margin-top: 12px;
    }
    .time {
      &__title {
        width: 100px;
        flex-shrink: 0;
        font-size: 20px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
        label {
          cursor: pointer;
        }

        &.disabled {
          pointer-events: none;
          input {
            display: none;
          }
        }
      }

      &__data {
        width: 100%;
        font-size: 0;
      }
    }
  }

  &__result {
    margin-top: 20px;

    .result {
      &__item {
        border: 3px solid $pGreen;
        border-radius: 8px;
        &:not(:first-of-type) {
          margin-top: 40px;
        }
      }

      &__name {
        display: block;
        margin-bottom: 8px;
        padding: 8px;
        border-bottom: 3px solid $pGreen;
        font-weight: 700;
        font-size: 30px;
      }

      &__content {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      &__chart {
        display: inline-block;
        flex-shrink: 0;
        margin-top: 8px;
        height: 350px;

        &--bar {
          width: 700px;
        }
      }

      &__summary {
        width: 200px;
        .summary {
          &__box {
            border: 1px solid $pRed;
            background: $pPurple;
            border-radius: 8px;
            padding: 8px;

            &:not(:first-of-type) {
              margin-top: 8px;
            }
          }

          &__header {
            position: relative;
            margin-bottom: 5px;
            font-weight: 700;
            font-size: 20px;
          }

          &__list {
            text-align: left;

            &:not(:first-of-type) {
              margin-top: 8px;
            }
          }

          &__name {
            font-weight: 700;
            font-size: 18px;
          }

          &__error {
            color: $red;
            font-size: 12px;
            margin-bottom: 6px;
          }

          &__data {
            font-size: 18px;
          }

          &__copy {
            position: absolute;
            right: 12px;
            top: 4px;
          }
        }
      }
    }
  }
}
</style>
