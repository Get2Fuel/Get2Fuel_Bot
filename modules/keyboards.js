import { Keyboard } from "grammy";

export const homeKeyboard = (ctx) => {
  return new Keyboard()
    .requestLocation(ctx.i18n.t("nearby"))
    .text(ctx.i18n.t("search"))
    .row()
    .text(ctx.i18n.t("favorites"))
    .text(ctx.i18n.t("settings"))
    .row()
    .text(ctx.i18n.t("help"))
    .text(ctx.i18n.t("info"));
};

export const locationKeyboard = (ctx) => {
  return new Keyboard().text(ctx.i18n.t("more")).row().text(ctx.i18n.t("back"));
};

export const searchKeyboard = (ctx) => {
  return new Keyboard()
    .text(ctx.i18n.t("location"))
    .row()
    .text(ctx.i18n.t("name"))
    .row()
    .text(ctx.i18n.t("brand"))
    .row()
    .text(ctx.i18n.t("back"));
};

export const settingsKeyboard = (ctx) => {
  return new Keyboard()
    .text(ctx.i18n.t("fuel"))
    .row()
    .text(ctx.i18n.t("tank"))
    .row()
    .text(ctx.i18n.t("back"));
};

export const fuelKeyboard = (ctx) => {
  return new Keyboard()
    .text(ctx.i18n.t("gasoline"))
    .row()
    .text(ctx.i18n.t("petrol"))
    .row()
    .text(ctx.i18n.t("cancel"));
};

export const tankKeyboard = (ctx) => {
  return new Keyboard().text(ctx.i18n.t("cancel"));
};

export const favoritesKeyboard = (ctx) => {
  return new Keyboard()
    .text(ctx.i18n.t("more"))
    .row()
    .text(ctx.i18n.t("remove"))
    .row()
    .text(ctx.i18n.t("back"));
};
