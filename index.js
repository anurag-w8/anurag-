import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  if (userText === "/start") {
    bot.sendMessage(chatId, "🤖 AI Bot Ready!");
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: userText }]
      })
    });

    const data = await response.json();
    console.log("API RESPONSE:", data);

    if (!data.choices || !data.choices[0]) {
      bot.sendMessage(chatId, "❌ API error: " + JSON.stringify(data));
      return;
    }

    const reply = data.choices[0].message.content;
    bot.sendMessage(chatId, reply);

  } catch (err) {
    bot.sendMessage(chatId, "Error: " + err.message);
  }
});
