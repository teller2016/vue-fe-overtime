import { ref, reactive, watch } from 'vue';
import { filterWeekAllExcel, getProjectList } from '@/composables/filterWeekAllExcel';
import getNameList from '@/composables/getNameList';

import {
  convertToBarChartData,
  convertToRoundChartData,
  getSummaryData,
  getSummaryTotalData,
  getSummaryTableRowData,
  getScheduleData,
} from '@/composables/convertToChartData';
import { copyText } from '@/composables/copyText';

export const weekAllComposable = () => {
  // 불러온 엑셀데이터
  const excelData = ref('');

  // 이름별 퇴근시간 (이름: 퇴근시간)
  const workEndTimeByName = ref({});

  // 다크 테마 공통 색상
  const darkTextColor = '#a1a1aa';
  const darkGridColor = 'rgba(255, 255, 255, 0.05)';

  // 바차트 옵션
  const barChartOptions = ref({
    responsive: true,
    color: darkTextColor,
    scales: {
      x: {
        ticks: { color: darkTextColor },
        grid: { color: darkGridColor },
      },
      y: {
        stacked: true,
        ticks: { color: darkTextColor },
        grid: { color: darkGridColor },
      },
    },
    plugins: {
      title: {
        display: true,
        text: '요일별 T/OT',
        color: '#d4d4d8',
        font: {
          size: 18,
        },
        padding: {
          bottom: 5,
        },
      },
      legend: {
        labels: { color: darkTextColor },
      },
    },
  });

  // 도넛차트 옵션
  const roundChartOptions = ref({
    cutoutPercentage: 85,
    color: darkTextColor,
    plugins: {
      title: {
        display: true,
        text: '전체 T/OT 합',
        color: '#d4d4d8',
        font: {
          size: 18,
        },
        padding: {
          bottom: 5,
        },
      },
      legend: {
        labels: { color: darkTextColor },
      },
    },
  });

  // 이름 리스트
  const nameList = ref([]);
  // 프로젝트 리스트
  const projectList = ref([]);
  // {이름: 데이터}
  const nameKeyData = ref({});
  // 요약 텍스트 영역
  const summaryText = ref(null);

  // 보이기 숨기기 처리
  const displayResult = ref({});

  const schedule = reactive({
    show: false,
    name: '',
  });

  // 요약된 데이터 셋팅
  const setNameKeyDataByExcelData = (name, filteredExcelData) => {
    const barChartData = convertToBarChartData(filteredExcelData);
    const roundChartData = convertToRoundChartData(filteredExcelData);
    const summaryData = getSummaryData(filteredExcelData);
    const summaryTotalData = getSummaryTotalData(filteredExcelData);
    const scheduleData = getScheduleData(filteredExcelData);

    // table row 데이터 Get
    const summaryTableRowData = getSummaryTableRowData(summaryData, projectList.value);

    nameKeyData.value[name] = {
      filteredExcelData,
      barChartData,
      roundChartData,
      summaryData,
      summaryTotalData,
      summaryTableRowData,
      scheduleData,
    };
    console.log(nameKeyData.value);
  };

  // 엑셀 데이터 불러오기
  const getExcelData = (data) => {
    excelData.value = data;

    // 이름 리스트 GET
    nameList.value = getNameList(data);
    // 프로젝트 리스트 GET
    projectList.value = getProjectList(data);

    nameKeyData.value = {}; // 초기화
    for (const [key, name] of Object.entries(nameList.value)) {
      const filteredExcelData = filterWeekAllExcel(excelData.value, name);
      setNameKeyDataByExcelData(name, filteredExcelData);
    }
  };

  // 이름별 출근시간 Watch
  watch(
    workEndTimeByName,
    () => {
      if (!excelData.value) return;

      nameKeyData.value = {};

      for (const [key, name] of Object.entries(nameList.value)) {
        const filteredExcelData = filterWeekAllExcel(excelData.value, name);
        setNameKeyDataByExcelData(name, filteredExcelData);
      }
    },
    { deep: true },
  );

  // 이름 리스트 Watch
  watch(nameList, () => {
    const displayResultObj = {};

    nameList.value.forEach((name) => {
      displayResultObj[name] = true;
    });

    displayResult.value = displayResultObj;
  });

  // 복사버튼 기능
  const onCopyText = (index) => {
    let textContent = summaryText.value[index].textContent.trim();

    let count = 0;
    textContent = textContent.replace(/\[/g, (match) => {
      count++;
      return count === 1 ? match : '\n\n[';
    });
    textContent = textContent.replaceAll('] T', ']\nT');
    textContent = textContent.replaceAll(' OT', '\nOT');
    copyText(textContent);
  };

  // dl 내 dd 내용 복사
  const copyScheduleList = (projectName, scheduleList) => {
    const text = `[${projectName}]\n${scheduleList.join('\n')}`;
    copyText(text);
  };

  // 일정 스케줄 상세보기 모달 노출
  const showScheduleDetail = (name) => {
    schedule.show = true;
    schedule.name = name;
  };

  return {
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
  };
};
