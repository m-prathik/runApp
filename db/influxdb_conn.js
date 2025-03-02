const {InfluxDB, Point} = require('@influxdata/influxdb-client');

const url = 'http://localhost:8086';
const token = 'avpDXJaOCF6QCH0nRLRWUDUkw9ZPMboL7E2VnEt7SWO43oOix0er-BmggUz3FCmm_M0_btZqyyaWmUgkJZ2p1Q==';
const org = 'dd';
const bucket = 'run_time_stamps';


// create a new influx db client

const influxDB = new InfluxDB({url, token});

// create a write api
const writeApi = influxDB.getWriteApi(org, bucket,'ms')
/**
 * 
 * runData = {
 *  "userId" : int,
 *  "distance" : float
 *  "metrics" : string,
 *  "runId" : "string"(auto generated from backend)
 *  "timeTaken" : string (hh:mm:ss) max(23:59:59)
 *  "route" : [
 *      {"latitude":float, "longitude":float, "heartBeat": int/null,"timeStamp":timeStamp},
 *      ..
 *      .. 
 *  ] 
 * 
 * 
 * 
 * }
 */

const jsonData = {
    "userID" : 3,
    "distance": 2.47,
    "metrics" : "km",
    "runId": "42309847",
    "timeTaken": "00:18:57",
    "route": [
        {"lat": 10.234083, "long": '18.3294723', "heartBeat" : null, "timeStamp": 1740895419}
    ]
}

function writeDataFromJson(jsonData) {
    //const points = 
    const points = [];
    jsonData.route.forEach(dataPoint => {
        const lat = parseFloat(dataPoint.lat);
        const long = parseFloat(dataPoint.long);
        const heartBeat = dataPoint.heartBeat !== null ? parseInt(dataPoint.heartBeat) : 0;
        console.log(lat);
        console.log(long);
        console.log(heartBeat);
        console.log('before writing : lat type:', typeof lat, 'long type:', typeof long, 'heartBeat type:', typeof heartBeat);
        const point = new Point('runRoute2')
        .tag('runId',jsonData.runId)
        .tag('userId', jsonData.userID)
        .floatField('lat', lat)
        .floatField('long',long)
        .intField('heartBeat', heartBeat)
        .timestamp(new Date(dataPoint.timeStamp * 1000));
        console.log("writing point:", point);
        points.push(point);
        //writeApi.writePoint(point);
        //return point;

    });
    if(points.length > 0) {
        console.log(points.length);
        writeApi.writePoints(points);
    }
    

    //writeApi.writePoints(points);
    writeApi.flush()
    .then(() => {
        console.log("Data points written to influxDb");
    })
    .catch((error) => {
        console.error('Error writing data to InfluxDb', error);
    })
}
async function checkWritingData() {
    await writeDataFromJson(jsonData);
}
writeDataFromJson(jsonData);
module.exports = {checkWritingData, influxDB};