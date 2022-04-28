import { Composer } from "grammy";
import { setGasoline, setPetrol } from "../models/setFuel.js";

const setFuel = new Composer();

setFuel.on(":text").hears(/🟢.*/, async (ctx) => setGasoline(ctx));
setFuel.on(":text").hears(/⚫.*/, async (ctx) => setPetrol(ctx));

export default setFuel;
