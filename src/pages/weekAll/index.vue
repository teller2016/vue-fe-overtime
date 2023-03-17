<template>
  <div class="sb__container">
    <!-- 옵션 영역 -->
    <div class="container__box">
      <div class="sb__options">
        <div class="sb__option">
          <header class="option__header">시간설정</header>

          <div class="option__content">
            <SelectElement
              selectTitle="출근시간"
              selectName="start-tiem"
              :items="workStartTimeList"
              v-model="workEndTime"
            >
            </SelectElement>
          </div>
        </div>

        <div class="sb__option">
          <header class="option__header">
            일지등록
            <NotificationPopup>
              <p class="sb__guide__text">
                * 작성하려는 주의 일지를 <em>Excel 파일</em>로 받아서
                등록해주세요.
              </p>
              <figure class="sb__guide__img">
                <img src="../../assets/images/weekGuide.png" alt="" />
              </figure>
            </NotificationPopup>
          </header>

          <div class="option__content">
            <p class="sb__options__guide">
              해당 주의 일지 excel파일을 불러와 주세요.
            </p>
            <DragDrop @get-excel-data="getExcelData" />
          </div>
        </div>
      </div>
    </div>

    <div class="sb__result">
      <div
        class="result__chart result__chart--bar"
        v-if="Object.keys(barChartData).length"
      >
        <Chart :data="barChartData" :options="barChartOptions" type="bar" />
      </div>
      <div
        class="result__chart result__chart--round"
        v-if="Object.keys(roundChartData).length"
      >
        <Chart
          :data="roundChartData"
          :options="roundChartOptions"
          type="round"
        />
      </div>

      <div class="result__summary" v-if="Object.keys(summaryData).length">
        <div class="summary__box">
          <h3 class="summary__header">
            요약
            <ButtonElement
              type="button"
              class="summary__copy"
              size="xxs"
              line="black"
              @on-click="onCopyText"
              >복사</ButtonElement
            >
          </h3>

          <div class="summary__content" ref="summaryText">
            <template v-for="(item, index) in summaryData" :key="index">
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
              <dd class="summary__error" v-if="summaryTotalData.T != 40">
                *T 전체 합이 40시간이 아닙니다!<br />(연차,휴일 혹은 데이터 확인
                필요)
              </dd>
              <dd class="summary__data">T: {{ summaryTotalData.T }}</dd>
              <dd class="summary__data">OT: {{ summaryTotalData.OT }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Chart from "@/components/utils/Chart.vue";
import SelectElement from "@/components/elements/SelectElement.vue";
import ButtonElement from "@/components/elements/ButtonElement.vue";
import DragDrop from "@/components/DragDrop.vue";
import NotificationPopup from "@/components/utils/NotificationPopup.vue";
import filterWeekAllExcel from "@/composables/filterWeekAllExcel";
import getNameList from "@/composables/getNameList";
import {
  convertToBarChartData,
  convertToRoundChartData,
  getSummaryData,
  getSummaryTotalData,
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

    const workEndTime = ref(workStartTimeList[1].value);
    const excelData = ref("");

    const barChartData = ref({});
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

    const roundChartData = ref({});
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

    const summaryData = ref({});
    const summaryText = ref(null);

    const summaryTotalData = ref({});

    // 이름 리스트
    const nameList = ref("");
    // {이름: 데이터}
    const nameKeyData = ref({});

    const getExcelData = (data) => {
      excelData.value = data;

      nameList.value = getNameList(data);

      nameKeyData.value = {}; // 초기화
      for (const [key, name] of Object.entries(nameList.value)) {
        const filteredExcelData = filterWeekAllExcel(
          data,
          workEndTime.value,
          name
        );
        const barChartData = convertToBarChartData(filteredExcelData);
        const roundChartData = convertToRoundChartData(filteredExcelData);
        const summaryData = getSummaryData(filteredExcelData);
        const summaryTotalData = getSummaryTotalData(filteredExcelData);

        nameKeyData.value[name] = {
          filteredExcelData,
          barChartData,
          roundChartData,
          summaryData,
          summaryTotalData,
        };
      }
      console.log(nameKeyData.value);
    };

    watch(workEndTime, () => {
      // if (!excelData.value) return;
      // filteredExcelData.value = filterWeekAllExcel(
      //   excelData.value,
      //   workEndTime.value
      // );
      // barChartData.value = convertToBarChartData(filteredExcelData.value);
      // roundChartData.value = convertToRoundChartData(filteredExcelData.value);
      // summaryData.value = getSummaryData(filteredExcelData.value);
      // summaryTotalData.value = getSummaryTotalData(filteredExcelData.value);
    });

    const onCopyText = () => {
      let textContent = summaryText.value.textContent.trim();

      let count = 0;
      textContent = textContent.replace(/\[/g, (match) => {
        count++;
        return count === 1 ? match : "\n\n[";
      });
      textContent = textContent.replaceAll("]T", "]\nT");
      textContent = textContent.replaceAll(" OT", "\nOT");
      copyText(textContent);
    };

    return {
      workStartTimeList,
      workEndTime,
      getExcelData,
      barChartData,
      barChartOptions,
      roundChartData,
      roundChartOptions,
      summaryData,
      onCopyText,
      summaryText,
      summaryTotalData,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  &__container {
    width: 1280px;
    margin: 0 auto;
  }

  &__result {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 8px;

    .result {
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
