var h = 600;
var w = 800;
var cell_len = 10;

var cell_h = Math.floor(h / cell_len);
var cell_w = Math.floor(w / cell_len);

var frame_rate = 30;

var value_map;
var own_map;
var people_list;

var max_value = 100;
var initial_money = 500;

function rand_pix() {
  return Math.floor(Math.random() * 256);
}





function find_idx_from_id(id){
  for( var i = 0; i < people_list.length; i++ ){
    if( people_list[i].id == id ){
      return i;
    }
  }
}

function find_min_max_money(){
  var min_money = 999999999999;
  var max_money = -1;
  for( var i = 0; i < people_list.length; i++ ){
    if( people_list[i].money > max_money ){
      max_money = people_list[i].money;
    }
    if( people_list[i].money < min_money ){
      min_money = people_list[i].money;
    }
  }
  return [min_money, max_money];
}

class Person {
  constructor(x, y, id) {
    this.cell_list = [
      [x, y]
    ];
    this.money_manage = Math.random() / 2;
    this.money = initial_money;

    this.hue = rand_pix();
    this.saturation = Math.floor(this.money_manage * 400) + 56;
    this.brightness = 0;

    this.id = id;

  }
  
  remove_cell(x,y){
    
    for( var i = 0; i < this.cell_list.length; i++ ){
      if( this.cell_list[i][0] == x && this.cell_list[i][1] == y ){
        this.cell_list.splice(i, 1);
        break;
      }
    }
  }
  
}

function randomize_value_map() {
  value_map = [];
  for (var i = 0; i < cell_h; i++) {
    value_map[i] = [];
    for (var j = 0; j < cell_w; j++) {
      value_map[i][j] = Math.floor(Math.random() * max_value + 1);
    }
  }
}

function draw_cells() {
  strokeWeight(0);
  stroke(0, 0, 0);
  
  for( var i = 0; i < people_list.length; i++ ){

    var hue = people_list[i].hue;
    var sat = people_list[i].saturation;
    var bri = people_list[i].brightness;

    fill( color(hue, sat, bri) );
    for( var j = 0; j < people_list[i].cell_list.length; j++ ){
      rect(  people_list[i].cell_list[j][1] * cell_len, 
             people_list[i].cell_list[j][0] * cell_len,
             cell_len,
             cell_len
          );
    }
  }

}

function iterate_people(){
  for( let p_idx = 0; p_idx < people_list.length; p_idx++ ){
    
    if( people_list[p_idx].cell_list.length == 0 ) continue;
    
    for( let c_idx = 0; c_idx < people_list[p_idx].cell_list.length; c_idx++ ){
      let i = people_list[p_idx].cell_list[c_idx][0];
      let j = people_list[p_idx].cell_list[c_idx][1];
      
      people_list[p_idx].money += value_map[i][j] / 100;
    }
    
    for( let c_idx = 0; c_idx < people_list[p_idx].cell_list.length; c_idx++ ){
      let i = people_list[p_idx].cell_list[c_idx][0];
      let j = people_list[p_idx].cell_list[c_idx][1];
      
      let coordinates = [];
      if( i - 1 >= 0 && own_map[i-1][j] != people_list[p_idx].id ){
        coordinates.push( [i-1, j] );
      }
      if( i + 1 < cell_h && own_map[i+1][j] != people_list[p_idx].id ){
        coordinates.push( [i+1, j] );
      }
      if( j - 1 >= 0 && own_map[i][j-1] != people_list[p_idx].id ){
        coordinates.push( [i, j-1] );
      }
      if( j + 1 < cell_w && own_map[i][j+1] != people_list[p_idx].id ){
        coordinates.push( [i, j+1] );
      }
      
      for( var coord_idx = 0; coord_idx < coordinates.length; coord_idx++ ){
        let x = coordinates[coord_idx][0];
        let y = coordinates[coord_idx][1];
        
        let own_idx = find_idx_from_id( own_map[x][y] );
        let val = value_map[x][y];
        
        if( people_list[p_idx].money * people_list[p_idx].money_manage > val ){
          if( people_list[p_idx].money > people_list[own_idx].money ){
            people_list[own_idx].money += val;
            people_list[p_idx].money -= val;
            
            people_list[own_idx].remove_cell(x,y);           
            own_map[x][y] = people_list[p_idx].id;
            people_list[p_idx].cell_list.push([x,y]);
            
          }
        }
      }
      
    }
    
  }
  
  var new_people_list = [];

  for( let p_idx = 0; p_idx < people_list.length; p_idx++ ){
    if( people_list[p_idx].cell_list.length != 0 ){
      new_people_list.push(people_list[p_idx]);
    }
  }

  people_list = new_people_list;

  [min_money, max_money] = find_min_max_money();
  diff = max_money - min_money;

  for( let p_idx = 0; p_idx < people_list.length; p_idx++ ){
    var normalized_money = (people_list[p_idx].money - min_money) / diff;
    people_list[p_idx].brightness = Math.floor(200 * normalized_money) + 56;
  }

  
}

function setup() {

  colorMode(HSB, 255);

  people_list = [];
  own_map = [];
  for (var i = 0; i < cell_h; i++) {
    own_map[i] = [];
    for (var j = 0; j < cell_w; j++) {
      people_list[i * cell_w + j] = new Person(i, j, i * cell_w + j);
      own_map[i][j] = i * cell_w + j;
    }
  }
  
  randomize_value_map();

  frameRate(frame_rate);
  var canvas = createCanvas(w, h);
  canvas.parent('animation');
  canvas.style('margin', 'auto');
  canvas.style('display', 'block');
  canvas.style('padding-top', '3%');
}


function draw() {
  if( people_list.length <= 1 ){
    noLoop();
  }
  background(155, 155, 155);
  draw_cells();
  iterate_people();
}