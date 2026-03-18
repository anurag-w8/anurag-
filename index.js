import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: userText }]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    bot.sendMessage(chatId, reply);

  } catch (err) {
    bot.sendMessage(chatId, "Error: " + err.message);
  }
});
