import axios from "axios";
import dayjs from "dayjs";

const pumpsFetcher = async (ctx) => {
  const latitude = ctx.message.location.latitude;
  const longitude = ctx.message.location.longitude;
  const fuel = ctx.session.fuel;
  // let response = "";
  let response = [];

  // const res = await axios.get(
  //   `http://${process.env.OSSERVAPREZZI_SERVER}/api/v1/pumps/query?latitude=${latitude}&longitude=${longitude}`
  // );

  const res = await axios.get(
    `http://${process.env.LOCALHOST}/api/v1/pumps/query?latitude=${latitude}&longitude=${longitude}`
  );

  res.data.forEach((pump, index) => {
    if (index <= 20) {
      const lastUpdate = new dayjs(pump.lastUpdate, "YYYY-MM-DD HH:mm:ss");
      const timeLimit = new dayjs().subtract(3, "days");
      if (lastUpdate.isAfter(timeLimit)) {
        response.push(pump);
      }
    }
  });

  return response;
};

export default pumpsFetcher;
