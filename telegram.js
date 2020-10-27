const axios = require("axios");
const telegramKeyJson = require("./telegramkey.json");
const telegramKey = telegramKeyJson.key;

function sendNotification(station,knots) {
  console.log(station,knots)
  axios
    .get(
      `https://api.telegram.org/bot${telegramKey}/sendMessage?chat_id=@eastcoaststrongwind&text=${station} got strong wind now, ${knots} knots`
    )
    .then(function (response) {
      // handle success
      // console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

module.exports = { sendNotification: sendNotification };
