import axios from "axios";
import dayjs from "dayjs";

const messageHandler = async (ctx) => {
  const latitude = ctx.message.location.latitude;
  const longitude = ctx.message.location.longitude;
  let response = "";

  const res = await axios.get(
    `http://${process.env.OSSERVAPREZZI_SERVER}/geolocate/${latitude}/${longitude}/gasoline/any`
  );

  res.data.pumps.forEach((pump, index) => {
    if (index <= 20) {
      const lastUpdate = new dayjs(pump.lastUpdate, "YYYY-MM-DD HH:mm:ss");
      const timeLimit = new dayjs().subtract(3, "days");
      if (lastUpdate.isAfter(timeLimit)) {
        response += `📅${pump.lastUpdate}\n<a href="https://www.google.com/maps/search/?api=1&query=${pump.lat},${pump.lon}">📍${pump.address}</a>\n🟢${pump.fuels.gasoline.self}\n⚫${pump.fuels.diesel.self}\n\n`;
      }
    }
  });

  return response;
};

export default messageHandler;
