import axios from "axios";
import EasyTable from "easy-table";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar.js";
import "dayjs/locale/it.js";
import { InlineKeyboard } from "grammy";
import buildReply from "./buildReply.js";
import { pumpMenu } from "./menu.js";

dayjs.extend(calendar);
dayjs.locale("it");

export const fetchPumpsByGeolocation = async (ctx) => {
  const latitude = ctx.message.location.latitude;
  const longitude = ctx.message.location.longitude;
  const fuel = ctx.session.fuel;
  let response = [];

  try {
    const res = await axios.get(
      `http://${process.env.OSSERVAPREZZI_SERVER}/api/legacy/pumps/query?latitude=${latitude}&longitude=${longitude}`
    );

    res.data.forEach((pump, index) => {
      const lastUpdate = new dayjs(pump.lastUpdate, "YYYY-MM-DD HH:mm:ss");
      const timeLimit = new dayjs().subtract(3, "days");
      if (lastUpdate.isAfter(timeLimit)) {
        response.push(pump);
      }
    });

    // sort response ascending by gasoline price
    response.sort((a, b) => {
      if (a.fuels.gasoline && b.fuels.gasoline) {
        if (!a.fuels.gasoline.self && b.fuels.gasoline.self) {
          return a.fuels.gasoline.served - b.fuels.gasoline.self;
        }
        if (a.fuels.gasoline.self && !b.fuels.gasoline.self) {
          return a.fuels.gasoline.self - b.fuels.gasoline.served;
        }
        return a.fuels.gasoline.self - b.fuels.gasoline.self;
      }
      return 0;
    });

    // remove response entries after 20th
    response = response.slice(0, 30);

    return response;
  } catch (error) {
    console.log("unable to fetch", error);
    return response;
  }
};

export const fetchPumpById = async (id) => {
  try {
    const res = await axios.get(
      `http://${process.env.OSSERVAPREZZI_SERVER}/api/legacy/pumps/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("unable to fetch", error);
    return {};
  }
};

export const fetchPumpByPosition = async (ctx) => {};

export const buildResponse = async ({ ctx, pump }) => {
  ctx.session.currentPump.id = ctx.session.response[0].pumpId;

  await buildReply({
    ctx,
    message: buildResponseMessage({ ctx, pump: ctx.session.response[0] }),
    inlineKeyboard: pumpMenu,
  });
};

export const buildResponseMessage = ({ ctx, pump }) => {
  const table = new EasyTable();
  const fuels = Object.keys(pump.fuels);
  fuels.forEach((fuel) => {
    table.cell(ctx.i18n.t("tableFuel"), ctx.i18n.t(`table${fuel}`));
    table.cell(ctx.i18n.t("tableSelf"), pump.fuels[fuel].self ?? "-");
    table.cell(ctx.i18n.t("tableServed"), pump.fuels[fuel].served ?? "-");
    table.newRow();
  });

  const responseMessage = `<a href="https://www.google.com/maps/search/?api=1&query=${
    pump.coordinates.latitude
  },${pump.coordinates.longitude}">📍${pump.address}</a>\n🕐${dayjs(
    dayjs(pump.lastUpdate).add(1, "hour")
  ).calendar()}\n<pre>${table.toString()}</pre>`;

  return responseMessage;
};
