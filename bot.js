 require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, '👋 Привет! Добро пожаловать в VisionMorph!\n\nВыбери что хочешь создать:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📸 Нейрофотосессия', web_app: { url: 'https://visionmorph.vercel.app' } }],
        [{ text: '🎬 Видео (Kling)', web_app: { url: 'https://visionmorph.vercel.app/video' } }]
      ]
    }
  });
});

console.log('Бот запущен!');

