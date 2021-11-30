var mode = "clock";
var heartRate = "";
var temperature = "";
var sleepInterval;

var img = require("heatshrink").decompress(atob("rVawJC/AH4AK/+AAYN/4AJDgP//gOC/wKF/4SBAYPgBQv4EAIWFBQItBBQIaCGQQGB+E/DQYABAwX+j4aCBQQGD54DCHAUPAwQADKYUDBQwhCJoQAFEIRCCAAhDCIQQhHG45lCG5HwG5KHCG465CN4ZOGg4KHJwIs4Q0EABQ7VCJw43CJxBkBcBZOHG4ROHG4QhHG4SdIG4IhIN4JwIG4QhHU4JwIG4YhHBQQhHIQRDHIQQhHIQYhGIQYhGQoSHHJoapHBQghFIQYhGZAQhHJojtFJogABJpCeFJop8FBQp8ETYZaGLAhaFLAo4EBQ44CMYo4EMYw4DMYw4DMYw4EBRA4BBRA4BNwyqDBRIA/AH4ACA="));

var statusBarHeight = 24;

function clearUnderWidgets() {
  g.clearRect(0, statusBarHeight, g.getWidth(), g.getHeight());
}

function drawTime() {
  var d = new Date();
  var h = ("0" + d.getHours()).substr(-2);
  var m = ("0" + d.getMinutes()).substr(-2);
  
  var circleSize = 60;
  g.reset();
  clearUnderWidgets();
  g.setColor("#ffffff");
  g.fillCircle(g.getWidth() / 2, g.getHeight() / 2, circleSize);
  
  var fontSize = 36;
  g.setColor("#000000");
  g.setFont("Vector", fontSize);
  g.setFontAlign(0, 0); // center font
  g.drawString(h+m, (g.getWidth()) / 2, (g.getHeight()) / 2);
}

function drawHeartRate() {
  var circleSize = 60;
  g.reset();
  clearUnderWidgets();
  
  g.setColor("#ffffff");
  g.drawImage(img, 15, statusBarHeight, {scale: 1.6});
  
  var fontSize = 36;
  var verticalOffset = 5;
  g.setColor("#000000");
  g.setFont("Vector", fontSize);
  g.setFontAlign(0, 0); // center font
  g.drawString(heartRate, (g.getWidth()) / 2, (g.getHeight()) / 2 + verticalOffset);  
}


function drawTemp() {
  var circleSize = 60;
  g.reset();
  clearUnderWidgets();
  g.setColor("#ffffff");
  g.fillCircle(g.getWidth() / 2, g.getHeight() / 2, circleSize);
  
  var fontSize = 36;
  g.setColor("#000000");
  g.setFont("Vector", fontSize);
  g.setFontAlign(0, 0); // center font
  g.drawString(temperature, (g.getWidth()) / 2, (g.getHeight()) / 2);
}


function redraw() {
  if (mode == "clock") {
    drawTime();
  } else if (mode == "heart") {
    drawHeartRate();
  } else if (mode == "temp") {
    drawTemp();
  }
}

function sleep() {
  Bangle.setHRMPower(0);
  Bangle.setBarometerPower(0);
  sleepTimerClear();
}

function sleepTimerStart() {
  sleepTimerClear()
  sleepInterval = setInterval(sleep, 60000);
}

function sleepTimerClear() {
  if (sleepInterval) clearInterval(sleepInterval);
  sleepInterval = undefined;
}

function wake() {
  Bangle.setHRMPower(1);
  Bangle.setBarometerPower(1);
}



g.clear();
wake();
drawTime();

var secondInterval;
Bangle.on("lcdPower", on => {
  if (secondInterval) clearInterval(secondInterval);
  secondInterval = undefined;
  if (on) {
    secondInterval = setInterval(draw, 1000);
    redraw();
    wake();
    sleepTimerStart();
  }
});

// Heart Rate

// Only on v2.10 (see hrm)
Bangle.on('HRM', function(heartrate) {
  heartRate = heartrate.bpm;
  redraw();
});

Bangle.on('touch', function(zone, e) {
  switch (mode) {
    case "clock":
      mode = "heart";
      break;
    case "heart":
      mode = "temp";
      break;
    case "temp":
    default:
      mode = "clock";
      break;
  }
  Bangle.setLCDBrightness(0.5);
  Bangle.buzz(100);
  redraw();
});

// Barometer
Bangle.on("pressure", (r) => {
  temperature = r.temperature.toFixed(1).toString() + "C";
});


Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
