import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Bot, session } from "grammy";
import { I18n } from "@grammyjs/i18n";
import actions from "./controllers/actions.js";
import pumps from "./controllers/pumps.js";
import settings from "./controllers/settings.js";
import setFuel from "./controllers/setFuel.js";
import buildReply from "./modules/buildReply.js";

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
    favorites: [
      { id: 47977, name: "gigante" },
      { id: 50286, name: "conad" },
      { id: 34929, name: "coop" },
    ],
    index: 0,
    response: [],
  };
};
bot.use(
  session({
    initial,
  })
);

// setup controllers
bot.use(actions);
bot.use(pumps);
bot.use(settings);
bot.use(setFuel);

// fallback action
bot.on("message", (ctx) => {
  buildReply({ ctx, messageId: "help-message" });
});

// start the bot
bot.start();
