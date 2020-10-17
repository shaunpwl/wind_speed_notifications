var CronJob = require("cron").CronJob;
const rp = require("request-promise-native");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { sendNotification } = require("./telegram");

function initCsvWriter() {
  csvWriter = createCsvWriter({
    path: "out.csv",
    header: [
      { id: "timestamp", title: "timestamp" },
      { id: "windspeed", title: "windspeed(knots)" },
    ],
    append: true,
  });
}

var options = {
  uri: "https://api.data.gov.sg/v1/environment/wind-speed",
  headers: {
    "User-Agent": "Request-Promise",
  },
  json: true, // Automatically parses the JSON string in the response
};

function apiToCsv() {
  rp(options)
    .then(function (data) {
      initCsvWriter();
      let csvdata = [
        {
          timestamp: "",
          windspeed: "",
        },
      ];
      csvdata[0].timestamp = data.items[0].timestamp;      
      data.items[0].readings.forEach(function (value) {
        //if it is east coast station
        if (value.station_id === "S107") {
          csvdata[0].windspeed = value.value;
          alertStrongWind(csvdata[0].windspeed);
          csvWriter.writeRecords(csvdata);
          // .then(() => console.log("The CSV file was written successfully"));
        }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}

var job = new CronJob(
  "*/5 * * * *",
  function () {
    apiToCsv();
  },
  null,
  true,
  "America/Los_Angeles"
);

function alertStrongWind(windspeed) {
  if (windspeed > 12) sendNotification(windspeed);
}

job.start();
