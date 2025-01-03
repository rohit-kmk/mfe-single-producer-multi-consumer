// data.js in remote app
let data = "Initial Data";

const getData = () => {
  return data;
};

const setData = (newData) => {
  data = newData;
};

export { getData, setData };
