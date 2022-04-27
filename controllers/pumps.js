import { Composer } from "grammy";
import { getPumpsByGeolocation, search, showMore } from "../models/pumps.js";

const pumps = new Composer();

pumps.on(":location", async (ctx) => getPumpsByGeolocation(ctx));
pumps.command("search", (ctx) => search(ctx));
pumps.on(":text").hears(/🔍.*/, (ctx) => search(ctx));
pumps.on(":text").hears(/➕.*/, async (ctx) => showMore(ctx));

export default pumps;
