import { Composer } from "grammy";
import { setFuelType, setTankSize } from "../models/settings.js";

const settings = new Composer();

settings.on(":text").hears(/⛽.*/, (ctx) => setFuelType(ctx));
settings.on(":text").hears(/🚗.*/, (ctx) => setTankSize(ctx));

export default settings;
