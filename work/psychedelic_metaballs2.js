/*   AUTHORS:  */
/* # Burak Bilge Yalçınkaya */
/* # Vahit Buğra Yeşilkaynak */
/* # Ersagun Kuruca */
/* 26.01.2021 */

var h = 600;
var w = 600;
var frame_rate = 10;

var points = [
  { pos: { x: 0, y: 0 }, vel: { x: 0.05, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0.02 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },
  { pos: { x: 0, y: 0 }, vel: { x: 0.01, y: 0 } },

]

function setup() {

  frameRate(frame_rate);
  var canvas = createCanvas(w, h);
  canvas.parent('animation');
  canvas.style('margin', 'auto');
  canvas.style('display', 'block');
  canvas.style('padding-top', '3%');
  frameRate(frame_rate);
  //blendMode(ADD);
  //colorMode(HSL, 360, 100, 100, 100);

  initPoints();
}

function initPoints() {
  points.forEach(function (p) {
    p.pos.x = random() * w;
    p.pos.y = random() * h;
    p.vel.x = random(-1, 1) * 0.05;
    p.vel.y = random(-1, 1) * 0.05;
  });
}


function metaValue(x, y, k = 1) {
  let total = 0;

  for (let i = 0; i < points.length; i++) {
    total += 1 / (Math.pow(x - points[i].pos.x, 2)
      + Math.pow(y - points[i].pos.y, 2)) ** k;
  }
  return total;
}

function fmod(x, m) {
  return x - Math.floor(x / m) * m
}
const HSIToRGB = ({ h, s, i, a = 1 }) => {
  s *= i;
  const sin = Math.sin(h) * s;
  const cos = Math.cos(h) * s;
  const n = 3 ** 0.5;
  let c = {
    r: i + 2 * cos + 0 * sin,
    g: i - 1 * cos + n * sin,
    b: i - 1 * cos - n * sin,
    a
  };
  return c;
};
const clampColor = (color, strategy) => {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  const avg = (color.r + color.g + color.b) / 3;

  const clamp = (a) => {
    const clampSat = (a, avg, minOrMax, plane) => {
      const t = (plane - avg) / (minOrMax - avg);
      return a * t + avg * (1 - t);
    };

    a =
      max > 1 || min < 0
        ? strategy === "clampSaturation"
          ?
          (avg * (max - min - 1) + min >= 0 // or clampSat(min, avg, max, 1) >= 0
            ? clampSat(a, avg, max, 1) :
            clampSat(a, avg, min, 0))
          : strategy === "clampBrightness"
            ? (max > 1 ? a / max : a)
            : a
        : a;
    return Math.min(Math.max(a, 0), 1);
  };
  return {
    r: clamp(color.r),
    g: clamp(color.g),
    b: clamp(color.b),
    a: color.a
  };
};
const toSRGB = (c) => (c <= 0.0031308 ? c * 12.92 : (1.055 * c) ** (1 / 2.4));
function screen(ox, oy) {

  //console.log(metaValue(points[0].pos.x, points[0].pos.y + 30));
  fill(200, 100, 100, 20);
  const a = 6;
  rectMode(CENTER);
  noStroke();
  for (let x = 0; x < w; x += a) {
    for (let y = 0; y < h; y += a) {
      var value = metaValue(ox + x, oy + y);
      //var value2 = metaValue(ox + x, oy + y, 2)

      //var value3 = metaValue(ox + x, oy + y, 0.5)
      //console.log(Math.exp(value * 10000));
      var c = HSIToRGB({ h: 1 / value * 0.25 / 180 * Math.PI, s: 0.5, i: 0.5 })
      //c = clampColor(c, "clampSaturation")
      fill(toSRGB(c.r) * 255, toSRGB(c.g) * 255, toSRGB(c.b) * 255);
      square(x, y, a);
    }
  }

}

var dt;

function draw() {
  dt = 160
  background(0, 0, 100, 100);
  //blendMode(ADD);
  //translate(w / 2, h / 2);
  //rotate(frameCount / 10);
  //translate(-w / 2, -h / 2);

  mean_x = 0;
  mean_y = 0;
  for (let i = 0; i < points.length; i++) {
    mean_x += points[i].pos.x;
    mean_y += points[i].pos.y;
  }

  mean_x = mean_x / points.length;
  mean_y = mean_y / points.length;

  push();
  translate(w / 2 - mean_x, h / 2 - mean_y);

  //physics
  points.forEach((point) => {
    point.pos.x += point.vel.x * dt;
    point.pos.y += point.vel.y * dt;

    //gravity
    points.forEach((otherPoint) => {
      if (point === otherPoint) {
        return;
      }
      var xDiff = (point.pos.x - otherPoint.pos.x)
      var yDiff = (point.pos.y - otherPoint.pos.y)
      var sqrDistance = xDiff ** 2 + yDiff ** 2;
      //sqrDistance = Math.max(30, sqrDistance);
      var distance = Math.sqrt(sqrDistance);
      var force = -0.001 / distance;

      if (distance < 30) force = 0;
      point.vel.x += force * (xDiff / distance) * dt;
      point.vel.y += force * (yDiff / distance) * dt;
    })

  })

  //draw points
  /*points.forEach((point) => {
    rect(point.pos.x, point.pos.y, 20, 20);
  })*/

  //rect(mean_x, mean_y, 20, 20);
  pop();
  screen(mean_x - w / 2, mean_y - h / 2);

}