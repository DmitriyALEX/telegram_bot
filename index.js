require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    `Ahoj ${ctx.message.from.first_name}! 
    Jsem chytrý bot a udělám pro tebe návod! Stačí jenom nahrát foto`,
    Markup.inlineKeyboard([[Markup.button.callback('Nahrát fotky', 'btn_1')]])
  )
);

bot.action('btn_1', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    ctx.replyWithHTML('Zašlete prosím 1 až 3 fotografie do tohoto chatu');
    await ctx.reply();
  } catch (e) {
    console.error(e);
  }
});

bot.on('text', (ctx) => ctx.reply('Tento chat slouží pouze ke zpracování foto. Máte-li nějaké dotazy, můžete nám je poslat na info@1line-art.com'));
bot.on('photo', async (ctx) => {
  await ctx.reply('Děkujeme! Náš specialista zpracuje Vaše fotografie a co nejdříve zašle návod');

  const fileId = ctx.message.photo[0].file_id;
  await ctx.telegram.sendPhoto(process.env.CHANNEL_ID, fileId);

  const user = ctx.message.from;
  const fullname = `${user.first_name ?? '-first name-'} ${user?.last_name ?? '-last name-'}`;
  const username = user?.username ?? '-username-';
  const msg = `The user ${fullname} (@${username}) sent a photo`;
  await ctx.telegram.sendMessage(process.env.CHANNEL_ID, msg);
});

bot.on('text', (msg) => {
  const { id } = msg.chat;
  bot.sendMessage(id);
});

bot.on('message', async (ctx) => {
  console.dir(ctx.message.photo, { depth: 5 });

  if (ctx.message?.photo) {
  }
});

bot.launch();

