<template>
  <div class="week-all">
    <!-- 상단 헤더 -->
    <header class="week-all__header">
      <h1 class="week-all__title">주간 전체 보고</h1>
      <p class="week-all__subtitle">팀원별 T/OT 현황을 한눈에 확인하세요</p>
    </header>

    <!-- 일지 등록 카드 -->
    <section class="week-all__upload">
      <div class="upload__card">
        <div class="upload__info">
          <h2 class="upload__title">
            일지 등록
            <NotificationPopup>
              <p class="upload__guide-text">
                * 작성하려는 주의 일지를 <em>[개인별 주간] => [엑셀]</em>로 받아서 등록해주세요.
              </p>
              <figure class="upload__guide-img">
                <img src="../../assets/images/weekAllGuide.png" alt="" />
              </figure>
            </NotificationPopup>
          </h2>
          <p class="upload__desc"><em>[개인별 주간] => [엑셀]</em> 순으로 Excel파일을 받아, 불러와 주세요.</p>
        </div>
        <DragDrop @get-excel-data="getExcelData" />
      </div>
    </section>

    <!-- 요약 테이블 -->
    <section class="week-all__table-section" v-if="Object.keys(nameKeyData).length">
      <h2 class="section__title">요약 테이블</h2>
      <div class="table__wrapper">
        <table class="week-all__table">
          <thead>
            <tr>
              <th class="table__th--name">이름</th>
              <th class="table__th--action">일정</th>
              <th v-for="project in projectList" :key="project">{{ project }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(nameData, name) in nameKeyData" :key="name" v-show="displayResult[name]">
              <td class="table__td--name" :class="{ 'table__td--error': nameKeyData[name].summaryTotalData.T !== 40 }">
                {{ name }}
              </td>
              <td class="table__td--action">
                <button class="table__btn" @click="showScheduleDetail(name)">상세보기</button>
              </td>
              <td v-for="(row, index) in nameData.summaryTableRowData" :key="index">
                {{ row }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 개인별 결과 카드 -->
    <section class="week-all__results">
      <article class="result-card" v-for="(nameData, name, index) in nameKeyData" :key="name" v-show="displayResult[name]">
        <header class="result-card__header">
          <h3 class="result-card__name">{{ name }}</h3>
          <span class="result-card__badge" :class="{ 'result-card__badge--warn': nameData.summaryTotalData.T !== 40 }">
            T: {{ nameData.summaryTotalData.T }}h
          </span>
        </header>

        <div class="result-card__body">
          <!-- 차트 영역 -->
          <div class="result-card__charts">
            <div class="chart-box chart-box--bar" v-if="Object.keys(nameData.barChartData).length">
              <Chart :data="nameData.barChartData" :options="barChartOptions" type="bar" />
            </div>
            <div class="chart-box chart-box--round" v-if="Object.keys(nameData.roundChartData).length">
              <Chart :data="nameData.roundChartData" :options="roundChartOptions" type="round" />
            </div>
          </div>

          <!-- 요약 영역 -->
          <div class="result-card__summary" v-if="Object.keys(nameData.summaryData).length">
            <div class="summary-card">
              <div class="summary-card__head">
                <h4>요약</h4>
                <button class="summary-card__copy-btn" @click="onCopyText(index)">복사</button>
              </div>
              <div class="summary-card__body" ref="summaryText">
                <template v-for="(item, idx) in nameData.summaryData" :key="idx">
                  <dl class="summary-item">
                    <dt class="summary-item__name">[{{ item.name }}]</dt>
                    <dd class="summary-item__data" v-if="item.T != 0">T: {{ item.T }} ({{ item.TMM }})</dd>
                    <dd class="summary-item__data" v-if="item.OT != 0">OT: {{ item.OT }} ({{ item.OTMM }})</dd>
                  </dl>
                </template>
              </div>
            </div>

            <div class="summary-card summary-card--total">
              <div class="summary-card__head">
                <h4>총합</h4>
              </div>
              <div class="summary-card__body">
                <dl class="summary-item">
                  <dd class="summary-item__error" v-if="nameData.summaryTotalData.T != 40">
                    *T 전체 합이 40시간이 아닙니다!<br />(연차,휴일 혹은 데이터 확인 필요)
                  </dd>
                  <dd class="summary-item__data">T: {{ nameData.summaryTotalData.T }}</dd>
                  <dd class="summary-item__data">OT: {{ nameData.summaryTotalData.OT }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <!-- 일정 상세 모달 -->
    <Modal v-model="schedule.show">
      <template v-slot:title>{{ schedule.name }}의 T/OT 상세 일정</template>
      <div class="schedule-modal">
        <div class="schedule-modal__content" v-for="(nameData, name) in nameKeyData" :key="name" v-show="schedule.name == name">
          <div class="schedule-modal__project" v-for="(scheduleData, projectName) in nameData.scheduleData" :key="projectName">
            <h2 class="schedule-modal__project-name">{{ projectName }}</h2>

            <dl class="schedule-modal__box" v-if="scheduleData.T.length">
              <dt class="schedule-modal__type schedule-modal__type--t">
                T
                <button class="schedule-modal__copy-btn" @click="copyScheduleList(projectName, scheduleData.T)">복사</button>
              </dt>
              <dd>[{{ projectName }}]</dd>
              <dd class="schedule-modal__detail" v-for="(TSchedule, index) in scheduleData.T" :key="index">
                {{ TSchedule }}
              </dd>
            </dl>

            <dl class="schedule-modal__box" v-if="scheduleData.OT.length">
              <dt class="schedule-modal__type schedule-modal__type--ot">
                OT
                <button class="schedule-modal__copy-btn" @click="copyScheduleList(projectName, scheduleData.OT)">복사</button>
              </dt>
              <dd>[{{ projectName }}]</dd>
              <dd class="schedule-modal__detail" v-for="(OTSchedule, index) in scheduleData.OT" :key="index">
                {{ OTSchedule }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
  import Chart from '@/components/utils/Chart.vue';
  import ButtonElement from '@/components/elements/ButtonElement.vue';
  import DragDrop from '@/components/DragDrop.vue';
  import NotificationPopup from '@/components/utils/NotificationPopup.vue';
  import Modal from '@/components/utils/Modal.vue';
  import { weekAllComposable } from '@/composables/pages/weekAll/index.ts';

  const {
    barChartOptions,
    roundChartOptions,
    nameKeyData,
    projectList,
    summaryText,
    displayResult,
    schedule,
    getExcelData,
    onCopyText,
    copyScheduleList,
    showScheduleDetail,
  } = weekAllComposable();
</script>

<style lang="scss" scoped>
  @import '@/styles/pages/weekAll/index.scss';
</style>
