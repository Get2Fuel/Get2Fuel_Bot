import { Bot, InlineKeyboard, session } from "grammy";
import { I18n } from "@grammyjs/i18n";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import pumpsFetcher from "./modules/pumpsFetcher.js";
import {
  homeKeyboard,
  searchKeyboard,
  locationKeyboard,
  settingsKeyboard,
  fuelKeyboard,
  tankKeyboard,
  favoritesKeyboard,
} from "./modules/keyboards.js";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar.js";
import "dayjs/locale/it.js";
import responseBuilder from "./modules/responseBuilder.js";
dayjs.extend(calendar);
dayjs.locale("it");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/.env" });

// setup bot
const bot = new Bot(process.env.BOT_TOKEN);
// setup i18n
const i18n = new I18n({
  defaultLanguageOnMissing: true,
  directory: __dirname + "/locales",
  useSession: true,
});
bot.use(i18n.middleware());
// setup session
const initial = () => {
  return {
    route: "home",
    fuel: "gasoline",
    tank: null,
    favorites: [],
    index: 0,
    response: [],
  };
};
bot.use(
  session({
    initial,
  })
);

// actions
bot.command("start", (ctx) => {
  const keyboard = homeKeyboard(ctx);

  ctx.reply(ctx.i18n.t("start-message"), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.command("search", (ctx) => {
  ctx.reply(ctx.i18n.t("search-message"), {
    parse_mode: "MarkdownV2",
  });
});

bot.command("favorites", (ctx) => {
  ctx.reply(ctx.i18n.t("favorites-message"), {
    parse_mode: "MarkdownV2",
  });
});

bot.command("settings", (ctx) => {
  const keyboard = settingsKeyboard(ctx);

  ctx.reply(ctx.i18n.t("settings-message"), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.command("info", (ctx) => {
  ctx.reply(ctx.i18n.t("info-message"), {
    parse_mode: "MarkdownV2",
  });
});

bot.on(":text").hears(/📝|🏷️|🗺️|🗑️|🚗.*/, async (ctx) => {
  ctx.session.route = "home";

  const keyboard = homeKeyboard(ctx);

  await ctx.reply("👨‍💻 Prossimamente disponibile");
  await ctx.reply("Scegli cosa fare:", {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.on(":text").hears(/➕.*/, async (ctx) => {
  if (ctx.session.index < ctx.session.response.length) {
    let index = ctx.session.index;
    for (
      ;
      index < ctx.session.index + 3 && index < ctx.session.response.length;
      index++
    ) {
      const pump = ctx.session.response[index];

      const inlineKeyboard = new InlineKeyboard().url(
        "🗺️ Naviga",
        `https://www.google.com/maps/search/?api=1&query=${pump.coordinates.latitude},${pump.coordinates.longitude}`
      );

      await ctx.reply(responseBuilder({ ctx, pump }), {
        parse_mode: "HTML",
        reply_markup: inlineKeyboard,
      });
    }
    ctx.session.index = index;
  } else {
    ctx.session.index = 0;
    ctx.session.route = "home";

    const keyboard = homeKeyboard(ctx);

    await ctx.reply("Risultati finiti");
    await ctx.reply("Scegli cosa fare:", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    });
  }
});

bot.on(":location", async (ctx) => {
  const keyboard = locationKeyboard(ctx);

  const response = await pumpsFetcher(ctx);

  ctx.session.response = response;

  await ctx.reply(ctx.i18n.t("results-message"), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });

  let index = 0;
  for (; index < 3; index++) {
    const pump = response[index];

    const inlineKeyboard = new InlineKeyboard().url(
      "🗺️ Naviga",
      `https://www.google.com/maps/search/?api=1&query=${pump.coordinates.latitude},${pump.coordinates.longitude}`
    );

    await ctx.reply(responseBuilder({ ctx, pump }), {
      parse_mode: "HTML",
      reply_markup: inlineKeyboard,
    });
  }
  ctx.session.index = index;
});

bot.on(":text").hears(/🔍.*/, (ctx) => {
  ctx.session.route = "search";

  const keyboard = searchKeyboard(ctx);

  ctx.reply(ctx.i18n.t("search-message"), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.on(":text").hears(/⭐.*/, (ctx) => {
  const favorites = ctx.session.favorites;

  if (favorites.length > 0) {
    ctx.session.route = "favorites";

    const keyboard = favoritesKeyboard(ctx);

    ctx.reply(ctx.i18n.t("favorites-message"), {
      parse_mode: "MarkdownV2",
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    });
  } else {
    ctx.session.route = "home";

    const keyboard = homeKeyboard(ctx);

    ctx.reply(ctx.i18n.t("nofavorites-message"), {
      parse_mode: "MarkdownV2",
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    });
  }
});

bot.on(":text").hears(/⚙️.*/, (ctx) => {
  ctx.session.route = "settings";

  const keyboard = settingsKeyboard(ctx);

  ctx.reply(ctx.i18n.t("settings-message"), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.on(":text").hears(/ℹ️.*/, (ctx) => {
  ctx.reply(ctx.i18n.t("info-message"), {
    parse_mode: "MarkdownV2",
  });
});

bot.on(":text").hears(/⛽.*/, (ctx) => {
  ctx.session.route = "fuel";

  const keyboard = fuelKeyboard(ctx);

  const fuel =
    ctx.session.fuel === "gasoline"
      ? ctx.i18n.t("gasoline")
      : ctx.i18n.t("petrol");

  ctx.reply(
    `Al momento stai cercando distributori di ${fuel}\\.\nScegli in base a cosa cercare:`,
    {
      parse_mode: "MarkdownV2",
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    }
  );
});

bot.on(":text").hears(/🚗.*/, (ctx) => {
  ctx.session.route = "tank";

  const keyboard = tankKeyboard(ctx);

  const tank = ctx.session.tank;

  if (tank) {
    ctx.reply(
      `Il tuo serbatoio è impostato su ${tank}L\\.\nInserisci il nuovo valore:`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          resize_keyboard: true,
          keyboard: keyboard.build(),
        },
      }
    );
  } else {
    ctx.reply(
      `Le dimensioni del serbatoio non sono impostate\nInserisci il nuovo valore:`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          resize_keyboard: true,
          keyboard: keyboard.build(),
        },
      }
    );
  }
});

bot.on(":text").hears(/↩️|❌.*/, (ctx) => {
  ctx.session.route = "home";

  const keyboard = homeKeyboard(ctx);

  ctx.reply("Perfetto, annullato", {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.on(":text").hears(/🟢.*/, async (ctx) => {
  ctx.session.route = "settings";
  ctx.session.fuel = "gasoline";

  const fuel = ctx.i18n.t("gasoline");
  const keyboard = settingsKeyboard(ctx);

  await ctx.reply(`Stai cercando distributori di ${fuel}`, {
    parse_mode: "MarkdownV2",
  });
  ctx.reply(ctx.i18n.t("settings-message"), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.on(":text").hears(/⚫.*/, async (ctx) => {
  ctx.session.route = "settings";
  ctx.session.fuel = "petrol";

  const fuel = ctx.i18n.t("petrol");
  const keyboard = settingsKeyboard(ctx);

  await ctx.reply(`Stai cercando distributori di ${fuel}`, {
    parse_mode: "MarkdownV2",
  });
  ctx.reply(ctx.i18n.t("settings-message"), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

// fallback action
bot.on("message", (ctx) => {
  ctx.reply(ctx.i18n.t("help-message"), {
    parse_mode: "MarkdownV2",
  });
});

// start the bot
bot.start();
