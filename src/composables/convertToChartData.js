const convertToBarChartData = (data) => {
  const labels = getDayList(data);
  const datasets = [];

  Object.values(data).forEach((project, index) => {
    if (project.getSum("T")) {
      datasets.push({
        label: `${project.getProjectName()} T`,
        data: project.getT(),
        stack: "T",
        backgroundColor: getColor(index, 0),
      });
    }

    if (project.getSum("OT")) {
      datasets.push({
        label: `${project.getProjectName()} OT`,
        data: project.getOT(),
        stack: "OT",
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
    datasets[0].data.push(project.getSum("T") + project.getSum("OT"));
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
    ["#ED5565", "#DA4453"],
    ["#FFCE54", "#F6BB42"],
    ["#48CFAD", "#37BC9B"],
    ["#5D9CEC", "#4A89DC"],
    ["#EC87C0", "#D770AD"],
    ["#FC6E51", "#E9573F"],
    ["#A0D468", "#8CC152"],
    ["#4FC1E9", "#3BAFDA"],
    ["#AC92EC", "#967ADC"],
  ];
  return color[index % color.length][type % 2];
};

const getSummaryData = (data) => {
  const summary = [];
  Object.values(data).forEach((project) => {
    summary.push({
      name: project.getProjectName(),
      T: project.getSum("T"),
      OT: project.getSum("OT"),
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
    totalT += project.getSum("T");
    totalOT += project.getSum("OT");
  });

  return {
    T: totalT,
    OT: totalOT,
  };
};

export {
  convertToBarChartData,
  convertToRoundChartData,
  getSummaryData,
  getSummaryTotalData,
};
