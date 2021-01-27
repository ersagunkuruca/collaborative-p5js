/*   AUTHORS:  */
/* # Burak Bilge Yalçınkaya */
/* # Vahit Buğra Yeşilkaynak */
/* January 2021 */

var h = 600;
var w = 600;
var frame_rate = 30;

var travelers;
var n_trav;
var min_speed;

function setup() {

  frameRate(frame_rate);
  var canvas = createCanvas(w, h);
  canvas.parent('animation');
  canvas.style('margin', 'auto');
  canvas.style('display', 'block');
  canvas.style('padding-top', '3%');

  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  travelers = []
  n_trav = 25;
  min_speed = 2;

  for( var i = 0; i < n_trav; i++ ){
    var speed = min_speed + (n_trav - i) / 2;
    travelers[i] = new Traveler(i, [10 * (i + 1), 10 * (i + 1)], color(360 * i / n_trav, 50, 50, 100));
  }

}

class Traveler {
  constructor(i, margin, color) {
    this.i = i;
    this.margin = margin;
    this.color = color;
    this.direction_state = 0;
    this.travel_h = 1;
    this.travel_w = 1;
    this.perimeter = ((h + w - 2 * margin[0] - 2 * margin[1]) * 2);
    this.travel_step = this.perimeter / 150;
  }

  travel(){

    fill(this.color);
    if( this.direction_state == 0 ) this.travel_h += this.travel_step;
    if( this.direction_state == 1 ) this.travel_w += this.travel_step;
    if( this.direction_state == 2 ) this.travel_h -= this.travel_step;
    if( this.direction_state == 3 ) this.travel_w -= this.travel_step;

    if( this.travel_h >= h - 2 * this.margin[1] || this.travel_w >= w - 2 * this.margin[0] || this.travel_h <= 0 || this.travel_w <= 0 )
    this.direction_state += 1;

    this.travel_h = min( h - 2 * this.margin[1] - 1, this.travel_h );
    this.travel_w = min( w - 2 * this.margin[0] - 1, this.travel_w );
    this.travel_h = max(1, this.travel_h);
    this.travel_w = max(1, this.travel_w);

    this.direction_state = this.direction_state % 4;

    ellipse(sin(frameCount * 0.1) * (this.margin[0] - w / 2 + this.travel_w), this.margin[1] - h / 2 + this.travel_h, 10, 10 );

  }
  
}

function draw() {

  background(0, 0, 0, 2);
  translate(w/2, h/2);
  
  t = frameCount / 5;
  
  const n = 42;
  const R = w / 4;
  color_shift = floor((frameCount % 100) / 20);

  
  push();
  for( var i = 0; i < n_trav; i++ )
    travelers[i].travel();
  pop();

/*
  fill(150, 55, 55, 100);
  ellipse(Math.sin(t) * 25 - w / 4, Math.cos(t) * 25 - h / 4, 55, 55);
  fill(100, 55, 55, 100);
  ellipse(Math.sin(t) * 25 + w / 4, Math.cos(t) * 25 - h / 4, 55, 55);
  fill(50, 55, 55, 100);
  ellipse(Math.sin(t) * 25 - w / 4, Math.cos(t) * 25 + h / 4, 55, 55);
  fill(0, 55, 55, 100);
  ellipse(Math.sin(t) * 25 + w / 4, Math.cos(t) * 25 + h / 4, 55, 55);
*/
}