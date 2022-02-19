import { MemorySessionStore, Telegraf } from "telegraf";
import { getLastHabr } from "./getHabr.js";
import { sendHabrMessage } from "./utils.js";

import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const bot = new Telegraf(process.env.BOT_TOKEN);

let sessionStorage = new MemorySessionStore();

const chatIdStorageName = "chatId";
const lastStorageHabrTitleName = "lastHabrTitle";

// bot.setMyCommands()

bot.command("start", async (ctx) => {
  const chatId = sessionStorage.get(chatIdStorageName);
  ctx.reply("[start]");
  if (!chatId) {
    sessionStorage.set(chatIdStorageName, ctx.message.chat.id);
    sendHabrInterval();
  }
});

bot.command("glh", async (ctx) => {
  const chatId = ctx.message.chat.id;
  const lastHabr = await getLastHabr();

  await sendHabrMessage(lastHabr, chatId);

  let lastStorageHabrTitle = sessionStorage.get(lastStorageHabrTitleName);
  if (!lastStorageHabrTitle || lastStorageHabrTitle != lastHabr.title) {
    sessionStorage.set(lastStorageHabrTitleName, lastHabr.title);
  }
});

function sendHabrInterval() {
  let interval = setInterval(async () => {
    const chatId = sessionStorage.get(chatIdStorageName);
    const lastStorageHabrTitle = sessionStorage.get(lastStorageHabrTitleName);

    const date = new Date().getHours();
    const lastHabr = await getLastHabr();

    if (
      chatId &&
      date >= 10 &&
      date <= 20 &&
      lastHabr.title != lastStorageHabrTitle
    ) {
      sessionStorage.set(lastStorageHabrTitleName, lastHabr.title);

      await sendHabrMessage(lastHabr, chatId);
    }
  }, 10 * 60 * 1000);
}

bot.launch();
