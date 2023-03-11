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
                <img
                  src="../../assets/images/excel_download_guide.png"
                  alt=""
                />
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
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Chart from "@/components/utils/Chart.vue";
import SelectElement from "@/components/elements/SelectElement.vue";
import DragDrop from "@/components/DragDrop.vue";
import NotificationPopup from "@/components/utils/NotificationPopup.vue";
import filterWeekExcelData from "@/composables/filterWeekExcel";
import {
  convertToBarChartData,
  convertToRoundChartData,
} from "@/composables/convertToChartData";

export default {
  components: {
    SelectElement,
    DragDrop,
    NotificationPopup,
    Chart,
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
    const filteredExcelData = ref("");

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

    const getExcelData = (data) => {
      excelData.value = data;

      filteredExcelData.value = filterWeekExcelData(data, workEndTime.value);
      barChartData.value = convertToBarChartData(filteredExcelData.value);
      roundChartData.value = convertToRoundChartData(filteredExcelData.value);
    };

    watch(workEndTime, () => {
      if (!excelData.value) return;
      filteredExcelData.value = filterWeekExcelData(
        excelData.value,
        workEndTime.value
      );
      barChartData.value = convertToBarChartData(filteredExcelData.value);
      roundChartData.value = convertToRoundChartData(filteredExcelData.value);
    });

    return {
      workStartTimeList,
      workEndTime,
      getExcelData,
      barChartData,
      barChartOptions,
      roundChartData,
      roundChartOptions,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  &__container {
    max-width: 1280px;
    margin: 0 auto;
  }

  &__result {
    display: flex;
    justify-content: space-between;
    gap: 12px;

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
      }
    }
  }
}
</style>
