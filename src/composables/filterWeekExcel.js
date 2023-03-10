class Project {
  constructor(name) {
    this.name = name;
    this.T = {};
    this.OT = {};
  }

  addData(day, T, OT) {
    this.T[day] = this.T[day] ? this.T[day] : 0;
    this.OT[day] = this.OT[day] ? this.OT[day] : 0;

    this.T[day] += T;
    this.OT[day] += OT;
  }
}

const filterWeekExcelData = (data, quitTime) => {
  console.log(data);

  const result = {};

  data.forEach((item) => {
    const day = item["일자"];
    const timeRange = item["시간"];
    const scheduleDetail = item["일정명"];

    const timeRangeList = timeRange.split(" ~ ");
    const timeRangeStart = timeRangeList[0];
    const timeRangeEnd = timeRangeList[1];

    if (
      !validateEndTimeData(timeRangeStart) ||
      !validateEndTimeData(timeRangeEnd)
    ) {
      console.error("ERROR 시간형식이 아닌 결과값 나옴");
      return;
    }

    // 9.5
    const startTime = timeToNumber(timeRangeStart);
    // 10.5
    const endTime = timeToNumber(timeRangeEnd);

    // 푸드케어
    const projectName = getProjectName(scheduleDetail);

    const { T, OT } = getWorkTime(startTime, endTime, quitTime);

    if (!result[projectName]) {
      result[projectName] = new Project(projectName);
    }
    const project = result[projectName];
    project.addData(day, T, OT);
  });
  console.log(result);
};

// 시간 정보 유효성 검사
const validateEndTimeData = (time) => {
  let pattern = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
  return pattern.test(time);
};

// 18:30 => 18.5
const timeToNumber = (time) => {
  const timeData = time.split(":");

  const hour = Number(timeData[0]);
  const minute = timeData[1];

  if (minute === "00") {
    return hour;
  } else {
    return hour + 0.5;
  }
};

const getProjectName = (scheduleDetail) => {
  const regex = /\[(.*?)\]/g;
  const matches = scheduleDetail
    .match(regex)
    .map((match) => match.slice(1, -1));

  const spaceRegex = /\s/g;
  const projectName = matches[0].replace(spaceRegex, "");

  return projectName;
};

const getWorkTime = (startTime, endTime, quitTime) => {
  let T = 0;
  let OT = 0;
  if (endTime <= quitTime) {
    T = endTime - startTime;
  } else if (quitTime <= startTime) {
    OT = endTime - startTime;
  } else {
    T = quitTime - startTime;
    OT = endTime - quitTime;
  }

  return {
    T,
    OT,
  };
};
export default filterWeekExcelData;
