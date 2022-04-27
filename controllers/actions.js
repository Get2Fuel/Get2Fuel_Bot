import { Composer } from "grammy";
import {
  start,
  favorites,
  settings,
  info,
  soonAvailable,
  cancel,
} from "../models/actions.js";

const actions = new Composer();

actions.command("start", (ctx) => start(ctx));
actions.command("favorites", (ctx) => favorites(ctx));
actions.on(":text").hears(/⭐.*/, (ctx) => favorites(ctx));
actions.command("settings", (ctx) => settings(ctx));
actions.on(":text").hears(/⚙️.*/, (ctx) => settings(ctx));
actions.command("info", (ctx) => info(ctx));
actions.on(":text").hears(/ℹ️.*/, (ctx) => info(ctx));
actions
  .on(":text")
  .hears(/📝|🏷️|🗺️|🗑️|🚗.*/, async (ctx) => soonAvailable(ctx));
actions.on(":text").hears(/↩️|❌.*/, (ctx) => cancel(ctx));

export default actions;
