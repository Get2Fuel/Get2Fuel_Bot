import buildReply from "../modules/buildReply.js";
import { fuelKeyboard, tankKeyboard } from "../modules/keyboards.js";

export const setFuelType = (ctx) => {
  ctx.session.route = "fuel";

  const fuel =
    ctx.session.fuel === "gasoline"
      ? ctx.i18n.t("gasoline")
      : ctx.i18n.t("petrol");

  buildReply({
    ctx,
    message: `Al momento stai cercando distributori di ${fuel}.\nScegli in base a cosa cercare:`,
    keyboard: fuelKeyboard(ctx),
  });
};
export const setTankSize = (ctx) => {
  ctx.session.route = "tank";

  const tank = ctx.session.tank;

  if (tank) {
    buildReply({
      ctx,
      message: `Il tuo serbatoio è impostato su ${tank}L.\nInserisci il nuovo valore:`,
      keyboard: tankKeyboard(ctx),
    });
  } else {
    buildReply({
      ctx,
      message: `Le dimensioni del serbatoio non sono impostate\nInserisci il nuovo valore:`,
      keyboard: tankKeyboard(ctx),
    });
  }
};
