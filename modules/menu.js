import { Menu } from "@grammyjs/menu";
import { buildResponseMessage } from "./pumps.js";

export const pumpMenu = new Menu("pump-menu")
  .text(
    (ctx) => buildFavoriteButton(ctx),
    (ctx) => toggleFavorite(ctx)
  )
  .row()
  .text("Precedente", (ctx) => {
    if (ctx.session.currentPump.index > 0) {
      ctx.session.currentPump.index--;
      return ctx.editMessageText(
        buildResponseMessage({
          ctx,
          pump: ctx.session.response[ctx.session.currentPump.index],
        }),
        { parse_mode: "HTML" }
      );
    }
    return;
  })
  .text("Prossimo", (ctx) => {
    if (ctx.session.currentPump.index < ctx.session.response.length - 1) {
      ctx.session.currentPump.index++;
      return ctx.editMessageText(
        buildResponseMessage({
          ctx,
          pump: ctx.session.response[ctx.session.currentPump.index],
        }),
        { parse_mode: "HTML" }
      );
    }
    return;
  });

const buildFavoriteButton = (ctx) => {
  return isPumpFavorite(ctx)
    ? "🚫 Rimuovi dai preferiti"
    : "⭐ Aggiungi ai preferiti";
};

const toggleFavorite = (ctx) => {
  isPumpFavorite(ctx) ? removeFavorite(ctx) : addFavorite(ctx);
  // console.log(ctx.session.favorites);
  // return ctx.reply("add to favorites");
  return ctx.menu.update();
};

const addFavorite = (ctx) => {
  ctx.session.favorites.push({
    id: ctx.session.response[ctx.session.currentPump.index].pumpId,
    name: ctx.session.response[ctx.session.currentPump.index].name,
  });
};

const removeFavorite = (ctx) => {
  ctx.session.favorites = ctx.session.favorites.filter(
    (favorite) =>
      favorite.id !== ctx.session.response[ctx.session.currentPump.index].pumpId
  );
};

const isPumpFavorite = (ctx) => {
  return !(
    ctx.session.favorites.find(
      (favorite) =>
        favorite.id ===
        ctx.session.response[ctx.session.currentPump.index].pumpId
    ) === undefined
  );
};
