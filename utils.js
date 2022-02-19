import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
const bot = new Telegraf(process.env.BOT_TOKEN);

const sendHabrMessage = async (lastHabr, chatId) => {
  const message = `
    🖥<b>${lastHabr.title}</b>\n\n💬${lastHabr.text}\n\n👉<a href="${lastHabr.link}">LINK</a>
  `;

  let imgSource;
  if (!lastHabr.img) {
    imgSource = {
      source: "./assets/programming.png",
    };
  } else {
    imgSource = {
      url: lastHabr.img,
    };
  }

  bot.telegram.sendPhoto(chatId, imgSource, {
    caption: message,
    parse_mode: "HTML",
  });
};

export { sendHabrMessage };
