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
  setup() {
    const dragDropActive = ref(false);
    const file = ref("");
    const labelText = ref("드래그하거나 클릭해서 업로드");

    const loadFileData = () => {
      const fileValue = file.value[0];
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        const workBook = XLSX.read(data, { type: "binary" });

        workBook.SheetNames.forEach((sheetName) => {
          const row = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
          console.log(row);
          // workResultData = filterExcelData(row);
        });
      };

      reader.readAsBinaryString(fileValue);
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
