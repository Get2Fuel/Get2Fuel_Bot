import buildReply from "../modules/buildReply.js";
import { settingsKeyboard } from "../modules/keyboards.js";

export const setGasoline = async (ctx) => {
  ctx.session.route = "settings";
  ctx.session.fuel = "gasoline";

  const fuel = ctx.i18n.t("gasoline");

  await buildReply({ ctx, message: `Stai cercando distributori di ${fuel}` });
  await buildReply({
    ctx,
    messageId: "settings-message",
    keyboard: settingsKeyboard(ctx),
  });
};
export const setPetrol = async (ctx) => {
  ctx.session.route = "settings";
  ctx.session.fuel = "petrol";

  const fuel = ctx.i18n.t("petrol");

  await buildReply({ ctx, message: `Stai cercando distributori di ${fuel}` });
  await buildReply({
    ctx,
    messageId: "settings-message",
    keyboard: settingsKeyboard(ctx),
  });
};
