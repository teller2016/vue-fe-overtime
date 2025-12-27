<template>
  <div class="sb__container">
    <!-- 옵션 영역 -->
    <div class="container__box">
      <div class="sb__options">
        <div class="sb__option">
          <header class="option__header">
            파일 등록
            <NotificationPopup>
              <p class="sb__guide__text">
                * 작성하려는 주의 일지를 <em>[개인캘린더] => [주] => [엑셀]</em>로 받아서 등록해주세요.
              </p>
              <figure class="sb__guide__img">
                <img style="width: 1200px" src="../../assets/images/personalWeekGuide.png" alt="" />
              </figure>
            </NotificationPopup>
          </header>

          <div class="option__content">
            <p class="sb__options__guide"><em>개인캘린더 > 주 > Excel</em> 파일을 불러와 주세요.</p>
            <DragDrop @get-excel-data="getExcelData" />
          </div>
        </div>
      </div>
    </div>

    <!-- 프로젝트별 T/OT 결과 -->
    <div class="sb__result" v-if="Object.keys(projectSummary).length">
      <h2 class="result__title">프로젝트별 T/OT</h2>

      <table class="result__table">
        <colgroup>
          <col style="width: 120px" />
          <col style="width: 120px" />
          <col style="width: 120px" />
          <col style="width: auto" />
        </colgroup>
        <thead>
          <tr>
            <th>프로젝트</th>
            <th>T / MM</th>
            <th>OT / MM</th>
            <th>일정 상세</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, project) in projectSummary" :key="project">
            <td>{{ project }}</td>
            <td>{{ data.T }} / {{ data.TMM }}</td>
            <td>{{ data.OT }} / {{ data.OTMM }}</td>
            <td class="result__schedules">
              <div v-for="(schedule, idx) in data.schedules" :key="idx" class="schedule__item">
                {{ schedule }}
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="result__total">
            <td>합계</td>
            <td>{{ totalSummary.T }}</td>
            <td>{{ totalSummary.OT }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
  import DragDrop from '@/components/DragDrop.vue';
  import personalWeekComposable from '@/composables/pages/personalWeek/index';
  import NotificationPopup from '@/components/utils/NotificationPopup.vue';

  const { excelData, getExcelData, projectSummary, totalSummary } = personalWeekComposable();
</script>

<style lang="scss" scoped>
  .sb {
    &__container {
      width: 1000px;
      margin: 0 auto;
    }

    &__result {
      margin-top: 30px;
      padding: 20px;
      border: 2px solid $pGreen;
      border-radius: 8px;

      .result {
        &__title {
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: 700;
          color: $pGreen;
        }

        &__table {
          width: 100%;
          border-collapse: collapse;

          th,
          td {
            padding: 12px 16px;
            text-align: center;
            border: 1px solid #ddd;
          }

          th {
            background: $pGreen;
            color: white;
            font-weight: 600;
          }

          td {
            background: #fff;
          }

          tbody tr:hover {
            background: #f5f5f5;
          }
        }

        &__total {
          td {
            background: #f0f8f0 !important;
            font-weight: 700;
            color: $pGreen;
          }
        }

        &__schedules {
          text-align: left;

          .schedule__item {
            text-align: left;
            display: block;
            margin: 2px 4px;
            padding: 4px 8px;
            background: #e8f5e9;
            border-radius: 4px;
            font-size: 13px;
            color: #2e7d32;
          }
        }
      }
    }
  }
</style>
