class Project {
  constructor(name) {
    this.name = name;
    this.T = {};
    this.OT = {};
    this.TScheduleList = [];
    this.OTScheduleList = [];
  }

  addData(day, T, OT) {
    this.T[day] = this.T[day] ? this.T[day] : 0;
    this.OT[day] = this.OT[day] ? this.OT[day] : 0;

    this.T[day] += T;
    this.OT[day] += OT;
  }

  getProjectName() {
    return this.name;
  }

  sortByKey(obj) {
    const arr = Object.entries(obj);
    arr.sort((a, b) => a[0].localeCompare(b[0]));
    const sortedObj = Object.fromEntries(arr);
    return sortedObj;
  }

  getSum(type) {
    let data = type == "T" ? this.T : this.OT;
    let sum = 0;
    for (let key in data) {
      sum += data[key];
    }

    return sum;
  }

  getT() {
    const sortedT = this.sortByKey(this.T);
    return Object.values(sortedT);
  }

  getOT() {
    const sortedOT = this.sortByKey(this.OT);
    return Object.values(sortedOT);
  }

  // 요일 배열 return
  getLabel() {
    const sortedT = this.sortByKey(this.T);
    return Object.keys(sortedT);
  }

  getScheduleList(type) {
    let duplicateList = type == "T" ? this.TScheduleList : this.OTScheduleList;

    return [...new Set(duplicateList)];
  }
}

const filterWeekAllExcel = (data, quitTime, name = "") => {
  const result = {};
  const daySet = new Set();

  data.forEach((item) => {
    // #region 자신이 포함된 데이터인지 판별
    // 개인주간보고 작성의 경우 이름구분 SKIP
    if (name) {
      const targetName = item["일정대상자"];
      if (!targetName.includes(name)) return;
    }
    // #endregion
    const day = item["일자"];
    daySet.add(day);
    const timeRange = item["시간"];
    const scheduleDetail = item["일정명"];

    // const timeRangeList = timeRange.split(" ~ ");
    const timeRangeStart = timeRange.trim().slice(0, 5);
    const timeRangeEnd = timeRange.trim().slice(-5);

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

    // 처음나오는 프로젝이면 Project객체 생성
    if (!result[projectName]) {
      result[projectName] = new Project(projectName);
    }
    const project = result[projectName];
    project.addData(day, T, OT);

    // 일정명(ex. [푸드케어] 주간회의) 저장
    if (T !== 0) {
      project.TScheduleList.push(scheduleDetail);
    }
    if (OT !== 0) {
      project.OTScheduleList.push(scheduleDetail);
    }
  });

  // 요일에 대한 데이터 없는경우 0 넣어주기 위해 처리
  for (let day of daySet) {
    Object.values(result).forEach((projectInstance) => {
      projectInstance.addData(day, 0, 0);
    });
  }

  return result;
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

  const match = scheduleDetail.match(regex);
  if (!match) return "NULL";
  const matches = match.map((match) => match.slice(1, -1));

  const spaceRegex = /\s/g;
  const projectName = matches[0].replace(spaceRegex, "");

  return projectName;
};

/**
 *
 * @param {*} startTime 일정 시작시간
 * @param {*} endTime 일정 끝 시간
 * @param {*} quitTime 퇴근시간
 * @returns
 */
const getWorkTime = (startTime, endTime, quitTime) => {
  // 00시까지 근무한 CASE
  if (endTime === 0) {
    endTime = 24;
  }

  let T = 0;
  let OT = 0;
  /**
   * 새벽 야근 case 처리
   * 야근으로 다음날 새벽까지 작업한 경우
   * ex. 00:00 ~ 01:00는 (18.5 - 9)[출근시간] 보다 이르니 야근으로 처리함)
   */
  if (endTime < quitTime - 9) {
    OT = endTime - startTime;
  } else if (endTime <= quitTime) {
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

// 프로젝트 목록 return
const getProjectList = (data) => {
  const projectSet = new Set();

  data.forEach((item) => {
    const scheduleDetail = item["일정명"];
    const projectName = getProjectName(scheduleDetail);

    projectSet.add(projectName);
  });

  const result = Array.from(projectSet);
  return result;
};

export { filterWeekAllExcel, getProjectList };
