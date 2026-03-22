<template>
  <div class="personal-week">
    <!-- 헤더 -->
    <header class="personal-week__header">
      <h1 class="personal-week__title">개인 주간보고 작성</h1>
      <p class="personal-week__subtitle">개인 캘린더 기반 T/OT 현황을 확인하세요</p>
    </header>

    <!-- 업로드 카드 -->
    <section class="personal-week__upload">
      <div class="upload__card">
        <div class="upload__info">
          <h2 class="upload__title">
            파일 등록
            <NotificationPopup>
              <p class="upload__guide-text">
                * 작성하려는 주의 일지를 <em>[개인캘린더] => [주] => [엑셀]</em>로 받아서 등록해주세요.
              </p>
              <figure class="upload__guide-img">
                <img style="width: 1200px" src="../../assets/images/personalWeekGuide.png" alt="" />
              </figure>
            </NotificationPopup>
          </h2>
          <p class="upload__desc"><em>개인캘린더 > 주 > Excel</em> 파일을 불러와 주세요.</p>
        </div>
        <DragDrop @get-excel-data="getExcelData" />
      </div>
    </section>

    <!-- 프로젝트별 T/OT 결과 -->
    <section class="personal-week__result" v-if="Object.keys(projectSummary).length">
      <h2 class="section__title">프로젝트별 T/OT</h2>

      <div class="table__wrapper">
        <table class="personal-week__table">
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
              <td class="table__td--project">{{ project }}</td>
              <td>{{ data.T }} / {{ data.TMM }}</td>
              <td>{{ data.OT }} / {{ data.OTMM }}</td>
              <td class="table__td--schedules">
                <!-- T 일정 -->
                <dl class="schedule-box" v-if="data.TSchedules.length">
                  <dt class="schedule-box__type schedule-box__type--t">
                    T
                    <button class="schedule-box__copy-btn" @click="copyScheduleList(project, data.TSchedules)">
                      복사
                    </button>
                  </dt>
                  <dd>[{{ project }}]</dd>
                  <dd class="schedule-box__detail" v-for="(schedule, idx) in data.TSchedules" :key="'t-' + idx">
                    {{ schedule }}
                  </dd>
                </dl>

                <!-- OT 일정 -->
                <dl class="schedule-box" v-if="data.OTSchedules.length">
                  <dt class="schedule-box__type schedule-box__type--ot">
                    OT
                    <button class="schedule-box__copy-btn" @click="copyScheduleList(project, data.OTSchedules)">
                      복사
                    </button>
                  </dt>
                  <dd>[{{ project }}]</dd>
                  <dd class="schedule-box__detail" v-for="(schedule, idx) in data.OTSchedules" :key="'ot-' + idx">
                    {{ schedule }}
                  </dd>
                </dl>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="table__tr--total">
              <td>합계</td>
              <td :class="{ 'table__td--warn': totalSummary.T !== 40 }">{{ totalSummary.T }}</td>
              <td>{{ totalSummary.OT }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
  import DragDrop from '@/components/DragDrop.vue';
  import personalWeekComposable from '@/composables/pages/personalWeek/index';
  import NotificationPopup from '@/components/utils/NotificationPopup.vue';

  const { excelData, getExcelData, projectSummary, totalSummary, copyScheduleList } = personalWeekComposable();
</script>

<style lang="scss" scoped>
  .personal-week {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px 80px;

    &__header {
      margin-bottom: 20px;
    }

    &__title {
      font-size: 20px;
      font-weight: 700;
      color: $accent-primary-light;
    }

    &__subtitle {
      margin-top: 4px;
      font-size: 12px;
      color: $dark-text-dim;
    }

    &__upload {
      margin-bottom: 36px;

      .upload {
        &__card {
          padding: 24px;
          background: $dark-card;
          border: 1px solid $dark-border;
          border-radius: 16px;
        }

        &__info {
          margin-bottom: 16px;
        }

        &__title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 600;
          color: $dark-text;
        }

        &__desc {
          margin-top: 6px;
          font-size: 13px;
          color: $dark-text-muted;

          em {
            color: $accent-primary;
            font-weight: 500;
          }
        }

        &__guide-text {
          font-size: 13px;
          color: $dark-text;

          em {
            color: $accent-primary;
            font-weight: 500;
          }
        }

        &__guide-img {
          margin-top: 8px;
        }
      }
    }

    &__result {
      .section__title {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 600;
        color: $dark-text-muted;
      }

      .table__wrapper {
        overflow-x: auto;
        border-radius: 12px;
        border: 1px solid $dark-border;
      }
    }

    &__table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      border-radius: 0;
      border: none;
      background: transparent;

      thead tr {
        background: rgba($accent-primary, 0.06) !important;
      }

      th {
        padding: 12px 14px;
        font-size: 12px;
        font-weight: 600;
        color: $accent-primary;
        letter-spacing: 0.02em;
        white-space: nowrap;
        border-bottom: 1px solid $dark-border;
      }

      tbody tr {
        background: transparent !important;
        transition: background 0.15s;

        &:hover {
          background: $dark-card-hover !important;
        }
      }

      td {
        padding: 10px 14px;
        font-size: 13px;
        color: $dark-text;
        text-align: center;
        border-bottom: 1px solid $dark-border;
      }

      .table {
        &__td--project {
          font-weight: 600;
        }

        &__td--schedules {
          text-align: left;
          padding: 8px 12px;
        }

        &__tr--total {
          td {
            background: rgba($accent-primary, 0.04) !important;
            font-weight: 700;
          }
        }

        &__td--warn {
          color: $accent-rose !important;
        }
      }
    }
  }

  /* 테이블 셀 안 일정 박스 */
  .schedule-box {
    padding: 10px;
    border-radius: 8px;
    background: $dark-card;
    border: 1px solid $dark-border;

    &:not(:first-of-type) {
      margin-top: 8px;
    }

    &__type {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 6px;

      &--t {
        color: $accent-green;
      }

      &--ot {
        color: $accent-amber;
      }
    }

    &__copy-btn {
      padding: 1px 6px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid $dark-border;
      border-radius: 4px;
      color: $dark-text-muted;
      font-size: 10px;
      margin-left: auto;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: $dark-text;
      }
    }

    &__detail {
      padding: 2px 0 2px 14px;
      font-size: 12px;
      color: $dark-text-muted;
      line-height: 1.5;
      position: relative;

      &::before {
        content: '›';
        position: absolute;
        left: 4px;
        color: $dark-text-dim;
      }
    }
  }
</style>
