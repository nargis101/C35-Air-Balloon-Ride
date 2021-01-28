var database, position;
var balloon, balloonImg, bg, canvas;



function preload(){
  bg = loadImage("images/background.png");
  balloonImg = loadAnimation("images/AirBalloon1.png", "images/AirBalloon2.png", 
  "images/AirBalloon3.png");
}

function setup() {
  database = firebase.database;
  canvas = createCanvas(800, 400);

  balloon = createSprite(400, 200, 50, 50);
  balloon.addAnimation("moving", balloonImg);
  balloon.scale = 0.4;

  var balloonPosition = database.ref('balloon/position');
  balloonPosition.on("value", readPosition, showError);
}

function draw() {
  background(bg); 
  if(position !== undefined){
    if(keyDown(LEFT_ARROW)){
      balloon.x = balloon.x - 5;
    }
  
    else if(keyDown(RIGHT_ARROW)){
      balloon.x = balloon.x + 5;
    }
  
    else if(keyDown(DOWN_ARROW)){
      balloon.y = balloon.y + 5;
    }
  
    else if(keyDown(UP_ARROW)){
      balloon.y = balloon.y - 5;
    }
  }


  textSize(15);
  fill(0);
  text("use the arrow keys to move the hot air balloon!!", 50, 20);

  drawSprites();
}


function updatePosition(x, y){
  database.ref('balloon/position').set({
    'x': height.x + x,
    'y': height.y + y
  })  
}

function readPosition(data){
  position = data.val();
  balloon.x = position.x;
  balloon.y = position.y;
}

function showError(){
  console.log("Error in writing to the database");
}

