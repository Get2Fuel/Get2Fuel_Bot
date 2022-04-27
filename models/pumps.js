import buildReply from "../modules/buildReply.js";

import {
  homeKeyboard,
  locationKeyboard,
  searchKeyboard,
} from "../modules/keyboards.js";
import { buildResponse, fetchPumpsByGeolocation } from "../modules/pumps.js";

export const getPumpsByGeolocation = async (ctx) => {
  const response = await fetchPumpsByGeolocation(ctx);

  ctx.session.response = response;

  await buildReply({
    ctx,
    messageId: "results-message",
    keyboard: locationKeyboard(ctx),
  });

  if (response.length !== 0) {
    let index = 0;
    for (; index < 3; index++) {
      const pump = response[index];

      await buildResponse({ ctx, pump });
    }
    ctx.session.index = index;
  } else {
    ctx.session.route = "home";

    await buildReply({
      ctx,
      message: "no pumps found",
      keyboard: homeKeyboard(ctx),
    });
  }
};
export const search = (ctx) => {
  ctx.session.route = "search";

  buildReply({
    ctx,
    messageId: "search-message",
    keyboard: searchKeyboard(ctx),
  });
};
export const showMore = async (ctx) => {
  if (ctx.session.index < ctx.session.response.length) {
    let index = ctx.session.index;
    for (
      ;
      index < ctx.session.index + 3 && index < ctx.session.response.length;
      index++
    ) {
      const pump = ctx.session.response[index];

      await buildResponse({ ctx, pump });
    }
    ctx.session.index = index;
  } else {
    ctx.session.index = 0;
    ctx.session.route = "home";

    await buildReply({ ctx, message: "Risultati finiti" });
    await buildReply({
      ctx,
      message: "Scegli cosa fare:",
      keyboard: homeKeyboard(ctx),
    });
  }
};
