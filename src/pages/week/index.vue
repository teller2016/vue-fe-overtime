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

    <div class="sb__chart">
      <BarChart />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import BarChart from "@/components/utils/BarChart.vue";
import SelectElement from "@/components/elements/SelectElement.vue";
import DragDrop from "@/components/DragDrop.vue";
import NotificationPopup from "@/components/utils/NotificationPopup.vue";
import filterWeekExcelData from "@/composables/filterWeekExcel";

export default {
  components: {
    SelectElement,
    DragDrop,
    NotificationPopup,
    BarChart,
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
    const result = ref("");

    const getExcelData = (data) => {
      excelData.value = data;
      result.value = filterWeekExcelData(data, workEndTime.value);
    };

    watch(workEndTime, () => {
      if (!excelData.value) return;
      result.value = filterWeekExcelData(excelData.value, workEndTime.value);
    });

    return {
      workStartTimeList,
      workEndTime,
      getExcelData,
      result,
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

  &__chart {
    display: block;
    margin: 0 auto;
    height: 350px;
  }
}
</style>
