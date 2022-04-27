const buildReply = async ({
  ctx,
  message,
  messageId,
  keyboard,
  inlineKeyboard,
}) => {
  await ctx.reply((messageId && ctx.i18n.t(messageId)) || message, {
    parse_mode: "HTML",
    reply_markup:
      (keyboard && {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      }) ||
      inlineKeyboard,
  });
};

export default buildReply;
