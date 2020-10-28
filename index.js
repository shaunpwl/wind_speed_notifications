var CronJob = require("cron").CronJob;
const rp = require("request-promise-native");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { sendNotification } = require("./telegram");

var job = new CronJob(
  "*/5 * * * *",
  function () {
    main();
  },
  null,
  true,
  "America/Los_Angeles"
);

function main() {
  rp(options)
    .then(function (data) {
      const timestamp = data.items[0].timestamp;
      
      initCsvWriter();
      data.items[0].readings.forEach(function (value) {        
          const windspeed = value.value;
          const station = mapStationId(value.station_id);
          
          alertStrongWind(station,windspeed);                    
          writeToCSV(timestamp,windspeed,station);
        
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function initCsvWriter() {
  csvWriter = createCsvWriter({
    path: "all.csv",
    header: [
      { id: "timestamp", title: "timestamp" },
      { id: "windspeed", title: "windspeed(knots)" },
      { id: "station", title: "station" },
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

function writeToCSV(timestamp,windspeed,station){
  let csvdata = [
    {
      timestamp: timestamp,
      windspeed: windspeed,
      station: station,
    },
  ];
  csvWriter.writeRecords(csvdata);            
}

function mapStationId(stationid){
  switch (stationid){
    case "S106":
      return "Pulau Ubin"
    case "S100":      
      return "Woodlands Road"
    case "S116":
      return "West Coast Highway"
    default:
      return stationid
  }    
}

function alertStrongWind(station,windspeed) {
  if (windspeed > 12) sendNotification(station,windspeed);
}

job.start();
