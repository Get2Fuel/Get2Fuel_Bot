require("dotenv").config();
const axios = require("axios");
const { Telegraf, Markup } = require("telegraf");

if (process.env.BOT_TOKEN === undefined) {
  throw new TypeError("BOT_TOKEN must be provided!");
}

const keyboard = Markup.keyboard([
  Markup.button.locationRequest("🗺️ Share my location"),
]);

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
console.log("Bot service is now running");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const handleMessage = (ctx) => {
  if (ctx.message.location) {
    const latitude = ctx.message.location.latitude;
    const longitude = ctx.message.location.longitude;

    axios
      .get(
        `http://localhost:61234/geolocate/${latitude}/${longitude}/gasoline/any`
      )
      .then((res) => {
        let str = "";
        res.data.pumps.slice(0, 20).map((pump) => {
          str += `📅${pump.lastUpdate}\n📍[${pump.address}](https://www.google.com/maps/search/?api=1&query=${pump.lat},${pump.lon})\n🏷️${pump.fuels.gasoline.self}\n\n`;
        });
        console.log(str);
        ctx.replyWithMarkdown(str, inlineKeyboard);
      });
  } else {
    ctx.replyWithMarkdown("Not a valid message");
  }
};
