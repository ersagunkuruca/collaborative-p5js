/*   AUTHORS:  */
/* # Burak Bilge Yalçınkaya */
/* # Vahit Buğra Yeşilkaynak */
/* 26.01.2021 */

var h = 600;
var w = 600;
var frame_rate = 10;

var thickness_ratio = 0.5;
var length_ratio = 0.9;

function drawTree(thickness, length) {
  if(thickness < 2) {
    /*
    if( random() < 0.5 )
      text('💵', random() * 5, 0);
    else
      text('🍔', random() * 5, 0);
    */
    text('🧑‍🤝‍🧑', random() * 5, 0);
    return;
  }
  
  push();

    strokeWeight(thickness);
    line(0, 0, 0, length);
    translate(0, length + thickness / 2);

    
    push();
      rotate(-PI/6);
      drawTree(thickness * thickness_ratio, length * length_ratio);
    pop();

    push();
      rotate(PI/6);
      drawTree(thickness * thickness_ratio, length * length_ratio);
    pop();

  pop();
}

function grass() {
  push();
    for(let i=-w/2; i<w/2; i+=20) {
      push();
        translate(i, 0);
        rotate(noise(frameRate * 0.001) / 8);
        text('💵', noise(frameRate * 0.001)*5, noise(frameRate * 0.001)*30 + 15);
      pop();
    }
  pop();
}

function draw() {
  background(0,0,100,100);
  textSize(32);
  translate(0, noise(frameCount * 0.01) * 50);
  translate(w/2, h);
  rotate(PI);

  rain();
  push();
  translate(w/5, -30);
  draw_();
  pop()
  
  
  push();
  translate(-w/4, -20);
  draw_();
  pop()
  
  push();
  translate(w/6, -50);
  draw_();
  pop()
  
  draw_();

  flood();
}

function flood(){

  translate(0, frameCount * 0.01);
  noStroke();
  fill(0, 100, 70, 40);
  for(let x = -w/2 - 40; x < w/2; x +=5) {
    rect(x,noise(frameCount * 0.1 , 1000 + x * 0.01) * 150 - 1000 + frameCount, 5, 1000);
  }

}

function draw_() {
  //noLoop();
  
  
  stroke(color(30, 67, 20));
  drawTree(80, 100);
  //grass();


  fill((noise(frameCount * 0.1) * 360) % 360, 60, 100, 20);

  square(-w, 0, 2*w+2*h);
}

var drops = [];

function rain(){
  var x = random() * w - w / 2;
  var y = h;

  if( frameCount % 30 )
    drops.push( [x, y] );
  
  for( var i = 0; i < drops.length; i++ ){
    push();
      translate(drops[i][0], drops[i][1]);
      translate(16, 16);
      rotate((random() - 0.5) * 0.1);
      rotate(PI);
      translate(-16, -16);
      fill(random() * 360, random() * 100, random() * 100);
      text('ZAM', 0, 0);
      drops[i][1] -= 5;
    pop();
  }

  new_drops = [];
  for( var i = 0; i < drops.length; i++ ){
    if( drops[i][1] > 0 ){
      new_drops.push( drops[i] );
    }
  }

  drops = new_drops;
}

function setup() {

  frameRate(frame_rate);
  var canvas = createCanvas(w, h);
  canvas.parent('animation');
  canvas.style('margin', 'auto');
  canvas.style('display', 'block');
  canvas.style('padding-top', '3%');
  frameRate(frame_rate);
  
  colorMode(HSB, 360, 100, 100, 100);
}