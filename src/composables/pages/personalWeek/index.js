import { ref, computed } from 'vue';
import mm from '@/composables/mm';

const personalWeekComposable = () => {
  // 불러온 엑셀 데이터
  const excelData = ref(null);

  // 시간 문자열을 시간(숫자)으로 변환 (예: "09:30-12:30" -> 3)
  const parseTimeToHours = (timeStr) => {
    if (!timeStr) return 0;

    const [start, end] = timeStr.split('-');
    if (!start || !end) return 0;

    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;

    return (endTotalMin - startTotalMin) / 60;
  };

  // 일정명에서 프로젝트명 추출 (대괄호 안의 내용)
  const extractProjectName = (scheduleName) => {
    if (!scheduleName) return '기타';
    const match = scheduleName.match(/\[([^\]]+)\]/);
    return match ? match[1] : '기타';
  };

  // 일정명에서 상세 내용 추출 (대괄호 뒤의 내용)
  const extractScheduleDetail = (scheduleName) => {
    if (!scheduleName) return '';
    // 대괄호와 그 안의 내용을 제거하고 나머지 텍스트 반환
    return scheduleName.replace(/\[[^\]]+\]\s*/, '').trim();
  };

  // 일자별 총 시간을 계산하여 T/OT 분리
  const calculateTOTByDate = (data) => {
    // 1단계: 일자별 총 시간 계산
    const dateHours = {};
    data.forEach((item) => {
      const date = item.일자;
      const hours = parseTimeToHours(item.시간);
      if (!dateHours[date]) {
        dateHours[date] = 0;
      }
      dateHours[date] += hours;
    });

    // 2단계: 일자별로 항목을 시간순 정렬하고 T/OT 분리
    const dateItems = {};
    data.forEach((item) => {
      const date = item.일자;
      if (!dateItems[date]) {
        dateItems[date] = [];
      }
      dateItems[date].push(item);
    });

    // 3단계: 일자별로 누적 시간 계산하여 T/OT 분리
    const result = [];
    Object.keys(dateItems).forEach((date) => {
      let accumulatedHours = 0;

      dateItems[date].forEach((item) => {
        const hours = parseTimeToHours(item.시간);
        const project = extractProjectName(item.일정명);

        // T와 OT 계산
        let T = 0;
        let OT = 0;

        if (accumulatedHours >= 8) {
          // 이미 8시간 초과한 상태면 모두 OT
          OT = hours;
        } else if (accumulatedHours + hours <= 8) {
          // 8시간 이내면 모두 T
          T = hours;
        } else {
          // 8시간을 넘어가는 경계
          T = 8 - accumulatedHours;
          OT = hours - T;
        }

        accumulatedHours += hours;

        result.push({
          date,
          project,
          scheduleName: item.일정명,
          hours,
          T,
          OT,
        });
      });
    });

    return result;
  };

  // 프로젝트별 T/OT 합계 계산
  const projectSummary = computed(() => {
    if (!excelData.value || !excelData.value.length) return {};

    const itemsWithTOT = calculateTOTByDate(excelData.value);
    const summary = {};

    itemsWithTOT.forEach((item) => {
      if (!summary[item.project]) {
        summary[item.project] = { T: 0, OT: 0, schedules: new Set() };
      }
      summary[item.project].T += item.T;
      summary[item.project].OT += item.OT;

      // 일정 상세 내용 추가 (중복 제거를 위해 Set 사용)
      const detail = extractScheduleDetail(item.scheduleName);
      if (detail) {
        summary[item.project].schedules.add(detail);
      }
    });

    // 소수점 정리 및 Set을 배열로 변환
    Object.keys(summary).forEach((project) => {
      summary[project].T = Math.round(summary[project].T * 10) / 10;
      summary[project].OT = Math.round(summary[project].OT * 10) / 10;
      summary[project].TMM = mm(summary[project].T);
      summary[project].OTMM = mm(summary[project].OT);
      summary[project].schedules = Array.from(summary[project].schedules);
    });

    return summary;
  });

  // 전체 T/OT 합계
  const totalSummary = computed(() => {
    const summary = projectSummary.value;
    let totalT = 0;
    let totalOT = 0;

    Object.values(summary).forEach((data) => {
      totalT += data.T;
      totalOT += data.OT;
    });

    return {
      T: Math.round(totalT * 10) / 10,
      OT: Math.round(totalOT * 10) / 10,
    };
  });

  // 엑셀 데이터 불러오기
  const getExcelData = (data) => {
    excelData.value = data;
    console.log('===== 파일 내용 =====');
    console.log(data);
    console.log('===== 프로젝트별 T/OT =====');
    console.log(projectSummary.value);
  };

  return {
    excelData,
    getExcelData,
    projectSummary,
    totalSummary,
  };
};

export default personalWeekComposable;
