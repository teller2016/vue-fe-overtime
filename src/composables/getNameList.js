const getNameList = (data) => {
  const nameSet = new Set();

  data.forEach((item) => {
    const name = item["등록자"];
    nameSet.add(name);
  });

  const result = Array.from(nameSet);
  return result;
};

export default getNameList;
