import buildReply from "../modules/buildReply.js";
import {
  favoritesKeyboard,
  homeKeyboard,
  settingsKeyboard,
} from "../modules/keyboards.js";
import { buildResponse, fetchPumpById } from "../modules/pumps.js";

export const start = (ctx) => {
  buildReply({
    ctx,
    messageId: "start-message",
    keyboard: homeKeyboard(ctx),
  });
};

export const favorites = (ctx) => {
  const favorites = ctx.session.favorites;

  if (favorites.length > 0) {
    // ctx.session.route = "favorites";

    buildReply({
      ctx,
      messageId: "favorites-message",
    });

    favorites.forEach(async (favorite) => {
      const pump = await fetchPumpById(favorite.id);

      buildResponse({ ctx, pump });
    });
  } else {
    ctx.session.route = "home";

    buildReply({
      ctx,
      messageId: "nofavorites-message",
      keyboard: homeKeyboard(ctx),
    });
  }
};
export const settings = (ctx) => {
  ctx.session.route = "settings";

  buildReply({
    ctx,
    messageId: "settings-message",
    keyboard: settingsKeyboard(ctx),
  });
};
export const info = (ctx) => {
  buildReply({
    ctx,
    messageId: "info-message",
  });
};
export const soonAvailable = async (ctx) => {
  ctx.session.route = "home";

  await buildReply({
    ctx,
    message: "👨‍💻 Prossimamente disponibile",
  });
  await buildReply({
    ctx,
    message: "Scegli cosa fare:",
    keyboard: homeKeyboard(ctx),
  });
};
export const cancel = (ctx) => {
  ctx.session.route = "home";

  buildReply({
    ctx,
    message: "Perfetto, annullato",
    keyboard: homeKeyboard(ctx),
  });
};
