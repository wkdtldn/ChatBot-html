var express = require("express");
var app = express();
var request = require("request");
var { OpenAIApi, Configuration } = require("openai");

let config = new Configuration({
  apiKey: "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",
});
let openai = new OpenAIApi(config);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

var client_id = "xHnOZVNBgKowpIzTTwCl";
var client_secret = "PeeAC4W9P0";

app.get("/translate", function (req, res) {
  var api_url = "https://openapi.naver.com/v1/papago/n2mt";
  var query = req.query.q;

  var options = {
    url: api_url,
    form: { source: "ko", target: "en", text: query },
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };
  request.post(options, function (error, response, body) {
    var 영어 = JSON.parse(body).message?.result.translatedText;

    openai
      .createCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: 영어,
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((result) => {
        console.log("ai 응답", result.data.choices[0].message.content);

        var api_url = "https://openai.naver.com/v1/papago/n2mt";
        var query = result.data.choices[0].message.content;
        var options = {
          url: url.api,
          form: { source: "ko", target: "en", text: query },
          headers: {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret,
          },
        };
        request.post(option, function (error, response, body) {
          console.log(body);
          res.status(200).json(body);
        });
      })
      .catch((error) => {
        console.log("openai error", error);
      });
  });
});

app.listen(3000, function () {
  console.log("http://127.0.0.1:3000/translate app listening on port 3000!");
});
