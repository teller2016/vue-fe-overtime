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
                * 작성하려는 주의 일지를 <em>[개인별 주간] => [엑셀]</em>로 받아서 등록해주세요.
              </p>
              <figure class="sb__guide__img">
                <img src="../../assets/images/weekAllGuide.png" alt="" />
              </figure>
            </NotificationPopup>
          </header>

          <div class="option__content">
            <p class="sb__options__guide"><em>[개인별 주간] => [엑셀]</em> 순으로 Excel파일을 받아, 불러와 주세요.</p>
            <DragDrop @get-excel-data="getExcelData" />
          </div>
        </div>

        <div class="sb__option"></div>
      </div>
    </div>

    <table class="sb__summaryTable" v-if="Object.keys(nameKeyData).length">
      <thead>
        <tr>
          <th></th>
          <th>일정<br />상세보기</th>
          <th v-for="project in projectList" :key="project">{{ project }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(nameData, name) in nameKeyData" :key="name" v-show="displayResult[name]">
          <th :class="{ error: nameKeyData[name].summaryTotalData.T !== 40 }">
            {{ name }}
          </th>
          <td>
            <ButtonElement
              type="button"
              class="summary__copy"
              size="xxs"
              line="black"
              @on-click="showScheduleDetail(name)"
              >일정확인</ButtonElement
            >
          </td>
          <td v-for="(row, index) in nameData.summaryTableRowData" :key="index">
            {{ row }}
          </td>
        </tr>
      </tbody>
    </table>

    <ul class="sb__result">
      <li class="result__item" v-for="(nameData, name, index) in nameKeyData" :key="name" v-show="displayResult[name]">
        <h3 class="result__name">{{ name }}</h3>
        <div class="result__content">
          <!-- 바 차트 -->
          <div class="result__chart result__chart--bar" v-if="Object.keys(nameData.barChartData).length">
            <Chart :data="nameData.barChartData" :options="barChartOptions" type="bar" />
          </div>
          <!-- 도넛 차트 -->
          <div class="result__chart result__chart--round" v-if="Object.keys(nameData.roundChartData).length">
            <Chart :data="nameData.roundChartData" :options="roundChartOptions" type="round" />
          </div>
          <!-- 요약 -->
          <div class="result__summary" v-if="Object.keys(nameData.summaryData).length">
            <div class="summary__box">
              <h3 class="summary__header">
                요약
                <ButtonElement type="button" class="summary__copy" size="xxs" line="black" @on-click="onCopyText(index)"
                  >복사</ButtonElement
                >
              </h3>

              <div class="summary__content" ref="summaryText">
                <template v-for="(item, index) in nameData.summaryData" :key="index">
                  <dl class="summary__list">
                    <dt class="summary__name">[{{ item.name }}]</dt>
                    <dd class="summary__data" v-if="item.T != 0">T: {{ item.T }} ({{ item.TMM }})</dd>
                    <dd class="summary__data" v-if="item.OT != 0">OT: {{ item.OT }} ({{ item.OTMM }})</dd>
                  </dl>
                  <br />
                </template>
              </div>
            </div>

            <div class="summary__box">
              <h3 class="summary__header">총합</h3>

              <div class="summary__content">
                <dl class="summary__list">
                  <dd class="summary__error" v-if="nameData.summaryTotalData.T != 40">
                    *T 전체 합이 40시간이 아닙니다!<br />(연차,휴일 혹은 데이터 확인 필요)
                  </dd>
                  <dd class="summary__data">T: {{ nameData.summaryTotalData.T }}</dd>
                  <dd class="summary__data">OT: {{ nameData.summaryTotalData.OT }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>

  <Modal v-model="schedule.show">
    <template v-slot:title>{{ schedule.name }}의 T/OT 상세 일정</template>
    <div class="sb__schedule">
      <!-- 일정명 데이터 loop (일정명데이터/ 이름) -->
      <div class="schedule__content" v-for="(nameData, name) in nameKeyData" :key="name" v-show="schedule.name == name">
        <!-- 프로젝트별 T, OT 일정명 loop (T,OT배열 / 프로젝트이름) -->
        <div class="schedule__item" v-for="(scheduleData, projectName) in nameData.scheduleData" :key="projectName">
          <!-- 프로젝트 이름 -->
          <h2 class="schedule__projectName">{{ projectName }}</h2>

          <!-- T -->
          <dl class="schedule__box" v-if="scheduleData.T.length">
            <dt class="schedule__type">
              T
              <button class="schedule__copyBtn" @click="copyScheduleList(projectName, scheduleData.T)">복사</button>
            </dt>
            <dd>[{{ projectName }}]</dd>
            <dd class="schedule__detail" v-for="(TSchedule, index) in scheduleData.T" :key="index">
              {{ TSchedule }}
            </dd>
          </dl>

          <!-- OT -->
          <dl class="schedule__box" v-if="scheduleData.OT.length">
            <dt class="schedule__type">
              OT
              <button class="schedule__copyBtn" @click="copyScheduleList(projectName, scheduleData.OT)">복사</button>
            </dt>
            <dd>[{{ projectName }}]</dd>
            <dd class="schedule__detail" v-for="(OTSchedule, index) in scheduleData.OT" :key="index">
              {{ OTSchedule }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </Modal>
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
