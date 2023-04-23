const getNameList = (data) => {
  console.log(data);
  const nameSet = new Set();

  data.forEach((item) => {
    const name = item["등록자"];
    const targetList = item["일정대상자"];

    // 일정대상자에 자신만 속하는 경우에 이름추가
    if (name === targetList) {
      nameSet.add(name);
    }
  });

  let result = Array.from(nameSet);

  // 입사한 순서로 처리
  result = managerOrder(result);

  return result;
};

const managerOrder = (nameList) => {
  const first = ["전동엽", "김승우", "임지원", "전민주", "정수범"];

  // 정렬된 값
  const resultFront = [];
  const resultBack = [];

  first.forEach((firstName) => {
    if (nameList.includes(firstName)) {
      resultFront.push(firstName);
    }
  });

  nameList.forEach((name) => {
    if (!first.includes(name)) {
      resultBack.push(name);
    }
  });

  return [...resultFront, ...resultBack];
};

export default getNameList;
