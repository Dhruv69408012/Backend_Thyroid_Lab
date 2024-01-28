const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.CHAT_GPT_API_KEY,
});

module.exports = openai;
