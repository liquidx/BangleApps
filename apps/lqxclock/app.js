function draw() {
  var d = new Date();
  var h = ("0" + d.getHours()).substr(-2);
  var m = ("0" + d.getMinutes()).substr(-2);
  
  
  var circleSize = 60;
  g.reset();
  g.setColor("#ffffff");
  g.fillCircle(g.getWidth() / 2, g.getHeight() / 2, circleSize);
  
  var fontSize = 36;
  g.setColor("#000000");
  g.setFont("Vector", fontSize);
  g.setFontAlign(0, 0); // center font
  g.drawString(h + m, (g.getWidth()) / 2, (g.getHeight()) / 2);
}

g.clear();
draw();

var secondInterval = undefined;
Bangle.on("lcdPower", on => {
  if (secondInterval) clearInterval(secondInterval);
  secondInterval = undefined;
  if (on) {
    secondInterval = setInterval(draw, 1000);
    draw();
  }
});

Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
