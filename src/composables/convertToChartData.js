const convertToBarChartData = (data) => {
  const labels = getDayList(data);
  const datasets = [];

  Object.values(data).forEach((project, index) => {
    if (project.getSum('T')) {
      datasets.push({
        label: `${project.getProjectName()} T`,
        data: project.getT(),
        stack: 'T',
        backgroundColor: getColor(index, 0),
      });
    }

    if (project.getSum('OT')) {
      datasets.push({
        label: `${project.getProjectName()} OT`,
        data: project.getOT(),
        stack: 'OT',
        backgroundColor: getColor(index, 1),
      });
    }
  });

  return {
    labels,
    datasets,
  };
};

const convertToRoundChartData = (data) => {
  const labels = [];
  const datasets = [
    {
      data: [],
      backgroundColor: [],
    },
  ];

  Object.values(data).forEach((project, index) => {
    labels.push(project.getProjectName());
    datasets[0].data.push(project.getSum('T') + project.getSum('OT'));
    datasets[0].backgroundColor.push(getColor(index, 0));
  });

  return {
    labels,
    datasets,
  };
};

const getDayList = (data) => {
  const project = Object.values(data)[0];
  return project.getLabel();
};

const getColor = (index = 0, type = 0) => {
  const color = [
    ['#d4a574', '#c4956a'], // 샌드
    ['#81c784', '#6db870'], // 세이지
    ['#e2c08d', '#d4b07d'], // 골드
    ['#e57373', '#d46363'], // 소프트 레드
    ['#a1a1aa', '#8e8e96'], // 뉴트럴
    ['#dcc07a', '#c8ac6a'], // 앰버
    ['#b0937a', '#9e836c'], // 코코아
    ['#8fbc8f', '#7daa7d'], // 다크 세이지
    ['#c9a87c', '#b8976c'], // 카멜
  ];
  return color[index % color.length][type % 2];
};

const getSummaryData = (data) => {
  const summary = [];
  Object.values(data).forEach((project) => {
    const T = project.getSum('T');
    const OT = project.getSum('OT');
    const TMM = project.getMM('T');
    const OTMM = project.getMM('OT');
    summary.push({
      name: project.getProjectName(),
      T,
      OT,
      TMM,
      OTMM,
    });
  });

  summary.sort((a, b) => {
    return Number(b.T) - Number(a.T);
  });

  return summary;
};

const getSummaryTotalData = (data) => {
  let totalT = 0;
  let totalOT = 0;
  Object.values(data).forEach((project) => {
    totalT += project.getSum('T');
    totalOT += project.getSum('OT');
  });

  return {
    T: totalT,
    OT: totalOT,
  };
};

// project에 대한 요약row 데이터 return (ex. ['X', '0.5 / 0', '24 / 0', 'X', 'X', 'X', '7 / 0', '0.5 / 0', 'X'])
const getSummaryTableRowData = (summaryData, projectList) => {
  const row = [];
  projectList.map((project) => {
    let workTime = '-';
    let data = summaryData.find((item) => {
      return item.name == project;
    });

    if (data) {
      workTime = `${data.T} / ${data.OT}`;
    }

    row.push(workTime);
  });

  return row;
};

// project 일정명 데이터 return
const getScheduleData = (data) => {
  let result = {};

  Object.values(data).forEach((project) => {
    result[project.getProjectName()] = {
      T: project.getScheduleList('T'),
      OT: project.getScheduleList('OT'),
    };
  });

  return result;
};

export {
  convertToBarChartData,
  convertToRoundChartData,
  getSummaryData,
  getSummaryTotalData,
  getSummaryTableRowData,
  getScheduleData,
};
