import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";
import { Telegraf, Markup } from "telegraf";
import dayjs from "dayjs";

dotenv.config();

if (process.env.BOT_TOKEN === undefined) {
  throw new TypeError("BOT_TOKEN must be provided!");
}

const keyboard = Markup.keyboard(
  [Markup.button.locationRequest("🗺️ Share my location")],
  [Markup.button.locationRequest("🆘 Help")]
);

const inlineKeyboard = Markup.inlineKeyboard([
  Markup.button.locationRequest("delete", "delete"),
]);

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply("Welcome to Get2Fuel bot\nPlease send me your location", keyboard)
);
bot.help((ctx) => ctx.reply("Help message"));
bot.on("message", (ctx) => handleMessage(ctx));
bot.action("delete", (ctx) => ctx.deleteMessage());

bot.launch();
// console.log("Bot service is now running");
fs.appendFile("bot.log", "Bot service is now running", (err) => {
  if (err) {
    console.error(err);
    return;
  }
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const handleMessage = (ctx) => {
  if (ctx.message.location) {
    const latitude = ctx.message.location.latitude;
    const longitude = ctx.message.location.longitude;

    axios
      .get(
        `http://${process.env.OSSERVAPREZZI_SERVER}/geolocate/${latitude}/${longitude}/gasoline/any`
      )
      .then((res) => {
        let str = "";
        res.data.pumps.forEach((pump, index) => {
          if (index <= 20) {
            const lastUpdate = new dayjs(
              pump.lastUpdate,
              "YYYY-MM-DD HH:mm:ss"
            );
            const timeLimit = new dayjs().subtract(3, "days");
            if (lastUpdate.isAfter(timeLimit)) {
              str += `📅${pump.lastUpdate}\n📍[${pump.address}](https://www.google.com/maps/search/?api=1&query=${pump.lat},${pump.lon})\n🟢${pump.fuels.gasoline.self}\n⚫${pump.fuels.diesel.self}\n\n`;
            }
          }
        });
        fs.appendFile("bot.log", str ?? null, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
        ctx.replyWithMarkdown(str, inlineKeyboard);
      });
  } else {
    ctx.replyWithMarkdown("Not a valid message");
  }
};
