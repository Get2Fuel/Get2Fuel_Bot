import { Bot, Keyboard } from "grammy";
import dotenv from "dotenv";
import messageHandler from "./messageHandler.js";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => {
  const text =
    "⚠️ *Warning*: this bot is currently in development ⚠️\n\nBenvenuto sul bot di Get2Fuel\\.\nInviando la tua posizione ti mostreremo un elenco di distributori convenienti nelle vicinanze\\.\n\nℹ️ *Nota*: non teniamo traccia dei dati di geolocalizzazione";
  ctx.reply(text, {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.command("info", (ctx) => {
  const text =
    "Inviando la tua posizione ti mostreremo un elenco di distributori convenienti nelle vicinanze\\.\n\nℹ️*Nota*: non teniamo traccia dei dati di geolocalizzazione";
  ctx.reply(text, {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.on(":location", async (ctx) => {
  const response = await messageHandler(ctx);
  ctx.reply(response, {
    parse_mode: "HTML",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.on(":text").hears("🔍 Cerca", (ctx) => {
  ctx.reply("👨‍💻 Prossimamente disponibile");
});

bot.on(":text").hears("ℹ️ Info", (ctx) => {
  ctx.reply(
    "Inviando la tua posizione ti mostreremo un elenco di distributori convenienti nelle vicinanze\\.\n\nℹ️*Nota*: non teniamo traccia dei dati di geolocalizzazione",
    {
      parse_mode: "MarkdownV2",
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    }
  );
});

bot.on("message", (ctx) => {
  ctx.reply(
    "*Elenco comandi:*\n/start: avvia il bot\n_📍 Vicino a me_ restituisce un elenco di distributori convenienti nelle vicinanze",
    {
      parse_mode: "MarkdownV2",
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    }
  );
});

bot.start();

const keyboard = new Keyboard()
  .requestLocation("📍 Vicino a me")
  .text("🔍 Cerca")
  .row()
  .text("🆘 Aiuto")
  .text("ℹ️ Info");
