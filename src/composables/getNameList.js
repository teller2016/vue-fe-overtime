const getNameList = (data) => {
  console.log(data);

  const nameSet = new Set();

  data.forEach((item) => {
    const name = item["등록자"];
    nameSet.add(name);
  });

  const result = Array.from(nameSet);
  console.log(Array.from(nameSet));
  return result;
};

export default getNameList;
