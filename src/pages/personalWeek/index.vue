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
            <td :class="{ warn: totalSummary.T !== 40 }">{{ totalSummary.T }}</td>
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
      border: 1px solid rgba($accent-primary, 0.15);
      border-radius: 12px;
      background: $dark-card;

      .result {
        &__title {
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: 700;
          color: $accent-primary;
        }

        &__table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 0;
          border: none;
          background: transparent;

          th,
          td {
            padding: 12px 16px;
            text-align: center;
            border: 1px solid $dark-border;
          }

          th {
            background: rgba($accent-primary, 0.06);
            color: $accent-primary;
            font-weight: 600;
          }

          td {
            background: transparent;
            color: $dark-text;
          }

          tbody tr:hover {
            background: $dark-card-hover;
          }
        }

        &__total {
          td {
            background: rgba($accent-primary, 0.06) !important;
            font-weight: 700;
            color: $dark-text;

            &.warn {
              color: $accent-rose;
            }
          }
        }

        &__schedules {
          text-align: left;

          .schedule__item {
            text-align: left;
            display: block;
            margin: 2px 4px;
            padding: 4px 8px;
            background: $accent-primary-dim;
            border-radius: 4px;
            font-size: 13px;
            color: $accent-primary;
          }
        }
      }
    }
  }
</style>
