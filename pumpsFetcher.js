import axios from "axios";
import dayjs from "dayjs";

const pumpsFetcher = async (ctx) => {
  const latitude = ctx.message.location.latitude;
  const longitude = ctx.message.location.longitude;
  const fuel = ctx.session.fuel;
  // let response = "";
  let response = [];

  const res = await axios.get(
    `http://${process.env.OSSERVAPREZZI_SERVER}/geolocate/${latitude}/${longitude}/${fuel}/any`
  );

  // const axios = require('axios');

  // const sendGetRequest = async () => {
  //     try {
  //         const resp = await axios.get('https://jsonplaceholder.typicode.com/posts');
  //         console.log(resp.data);
  //     } catch (err) {
  //         // Handle Error Here
  //         console.error(err);
  //     }
  // };

  // sendGetRequest();

  // res.data.pumps.forEach((pump, index) => {
  //   if (index <= 20) {
  //     const lastUpdate = new dayjs(pump.lastUpdate, "YYYY-MM-DD HH:mm:ss");
  //     const timeLimit = new dayjs().subtract(3, "days");
  //     if (lastUpdate.isAfter(timeLimit)) {
  //       response += `📅${pump.lastUpdate}\n<a href="https://www.google.com/maps/search/?api=1&query=${pump.lat},${pump.lon}">📍${pump.address}</a>\n🟢${pump.fuels.gasoline.self}\n⚫${pump.fuels.petrol.self}\n\n`;
  //     }
  //   }
  // });

  res.data.pumps.forEach((pump, index) => {
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
