const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
var axios = require("axios");
const { Telegraf } = require("telegraf");
const { response } = require("express");
const getUrls = require("get-urls");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("message", (ctx) => {
  if (ctx.message.text && ctx.message.text.includes("http")) {
    const url = Array.from(getUrls(ctx.message.text))[0];
    var config = {
      method: "post",
      url: `http://api.meaningcloud.com/summarization-1.0?key=${process.env.MEANING_CLOUD_KEY}&url=${url}&sentences=5`,
      headers: {},
    };
    axios(config)
      .then(function (response) {
        ctx.deleteMessage(ctx.message.message_id);
        return ctx.reply(`${response.data.summary}. More at ${url}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

bot.startPolling();

express()
  .get("/", (req, res) => res.send("This is a bot"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
