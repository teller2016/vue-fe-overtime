<template>
  <div class="sb__dragDrop">
    <label
      id="csv-file-label"
      class="dragDrop__label"
      :class="{ itemdrop: dragDropActive, active: file.length }"
      for="csv-file"
      @dragenter.prevent="toggleDragDropActive(true)"
      @dragleave.prevent="toggleDragDropActive(false)"
      @drop.prevent="dropEvent($event)"
      >{{ labelText }}</label
    >
    <input
      type="file"
      class="dragDrop__input"
      id="csv-file"
      accept=".xls,.xlsx"
      @change="uploadFile($event)"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import * as XLSX from "xlsx";
export default {
  setup(props, context) {
    const dragDropActive = ref(false);
    const file = ref("");
    const labelText = ref("드래그하거나 클릭해서 업로드");
    const workResultData = ref([]);

    const filterExcelData = (data) => {
      const dayTimeWorkData = {
        // 일: {
        //   totalDate: '22.08.01',
        //   year: '23',
        //   month: '08',
        //   day: '01',
        //   text: '[푸드케어] QA이슈처리',
        //   endTime: 18.5,
        // },
      };

      // 각 일 마지막 근무 시간
      const lastWorkTime = {};

      data.forEach((row) => {
        const rawMonthDay = row["일자"]; // "8.01(월)"
        const rawTime = row["시간"]; // "09:30-12:30"
        const rawText = row["일정명"]; // "[푸드케어] 정기식단 상세 MO (식단표 레이어)"

        lastWorkTime[rawMonthDay] = {
          rawTime: rawTime,
          rawText: rawText,
        };
      });

      for (const [rawDate, data] of Object.entries(lastWorkTime)) {
        // 날짜 데이터 정리
        // const year = $("select[name='year']").val();
        const year = "23";
        const dayMonth = rawDate.slice(0, -3).split(".");
        const month = dayMonth[0].padStart(2, "0"); // 08 => 월
        const day = dayMonth[1]; // 01 => 일

        const totalDate = [year, month, day].join("."); // 23.08.01

        // 시간 데이터 정리
        // 18:00-19:00에서 19:00 추출
        const stringEndTime = data["rawTime"].split("-")[1];
        // 데이터가 시간이 아닌경우 예외처리
        if (!validateEndTimeData(stringEndTime)) continue;

        // TODO: 임시 - 새벽 근무 처리
        if (stringEndTime == "23:59") {
          alert(
            `${day}일 데이터 및 총합 시간 수정이 필요합니다!\n(새벽근무의 경우 계산을 못했습니다)\n`
          );
        }

        const endTime = timeToNumber(stringEndTime);

        dayTimeWorkData[Number(day)] = {
          totalDate: totalDate,
          year: year,
          month: month,
          day: day,
          text: data["rawText"],
          endTime: endTime,
        };
      }

      return dayTimeWorkData;
    };

    // 엑셀 데이터 로드
    const loadFileData = () => {
      const fileValue = file.value[0];
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        const workBook = XLSX.read(data, { type: "binary" });

        workBook.SheetNames.forEach((sheetName) => {
          const row = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
          workResultData.value = filterExcelData(row);
        });

        context.emit("get-excel-data", workResultData.value);
      };

      reader.readAsBinaryString(fileValue);
    };

    // 시간 정보 유효성 검사
    const validateEndTimeData = (time) => {
      let pattern = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
      // console.log(time);
      // console.log(pattern.test(time));
      return pattern.test(time);
    };

    // 18:30 => 18.5
    const timeToNumber = (time) => {
      const timeData = time.split(":");

      const hour = Number(timeData[0]);
      const minute = timeData[1];

      if (minute === "00") {
        return hour;
      } else {
        return hour + 0.5;
      }
    };

    const toggleDragDropActive = (hasEntered) => {
      dragDropActive.value = hasEntered;
    };

    const dropEvent = ($event) => {
      toggleDragDropActive(false);
      file.value = $event.dataTransfer.files;
      labelText.value = file.value[0].name;

      loadFileData();
    };

    const uploadFile = ($event) => {
      file.value = $event.target.files;
      labelText.value = file.value[0].name;

      loadFileData();
    };

    return {
      labelText,
      dragDropActive,
      toggleDragDropActive,
      dropEvent,
      uploadFile,
      file,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  &__dragDrop {
    width: 100%;
    height: 180px;

    .dragDrop {
      &__label {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        border-radius: 8px;
        background: $gray100;
        cursor: pointer;

        &.itemdrop {
          &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            background: rgba($color: white, $alpha: 0.7)
              url("../assets/images/file.png") no-repeat center center / 50px
              auto;
          }
        }

        &.active {
          border: 2px solid black;
          background: #ddd;
        }
      }

      &__input {
        display: none;
      }
    }
  }
}
</style>
