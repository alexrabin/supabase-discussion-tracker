const getAllIndexes = (str: string, char: string) => {
  const indexes = [];

  for (let index = 0; index < str.length; index++) {
    if (str[index] === char) {
      indexes.push(index);
    }
  }
  return indexes;
};

export default getAllIndexes;
