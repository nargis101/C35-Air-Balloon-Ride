var balloon,balloon_moving, balloon_stop;
var database;
var PLAY = 1
var gameState = PLAY;
var END = 0;
var height;
var rock, rockImage, loseSound, rockGroup;
var pointImg, pointGroup;
var score = 0;

function preload(){
   bg =loadImage("Images/cityImage.png");
   balloon_stop = loadAnimation("Images/HotAirBallon-01.png", "Images/HotAirBallon-01.png", "Images/HotAirBallon-01.png");
   balloon_moving = loadAnimation("Images/HotAirBallon-01.png","Images/HotAirBallon-01.png",
   "Images/HotAirBallon-01.png","Images/HotAirBallon-02.png","Images/HotAirBallon-02.png",
   "Images/HotAirBallon-02.png","Images/HotAirBallon-03.png","Images/HotAirBallon-03.png","Images/HotAirBallon-03.png");
   rockImage = loadAnimation("Images/rock-01.png", "Images/rock-02.png", "Images/rock-03.png", 
   "Images/rock-04.png", "Images/rock-05.png", "Images/rock-06.png", "Images/rock-07.png", "Images/rock-08.png");
   loseSound = loadSound("Images/lose.mp3");
   pointImg = loadImage("Images/point.png");
   scoreSound = loadSound("Images/score.mp3");
   
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(1500,700);

  balloon=createSprite(250, 550,width/2,height/2);
  balloon.addAnimation("hotAirBalloon", balloon_moving);
  balloon.addAnimation("stop", balloon_stop);
  balloon.scale=0.5;

  scoreBalloon = createSprite(1350, 40, 10, 10);
  scoreBalloon.addImage(pointImg);
  scoreBalloon.scale = 0.5;


  var balloonHeight=database.ref('balloon/height');
  balloonHeight.on("value",readHeight, showError);

  rockGroup = new Group();
  pointGroup = new Group();

  spawnPoint();
}



// function to display UI
function draw() {
  background(bg);

  
  fill(0);
  stroke("white");
  textSize(20);
  text("use arrow keys to move Hot Air Balloon!",20,40);
  text("collect the balloons to get a point but make sure you don't get hit by the giant rocks!",20,60);

  textSize(20);
  text("=  " + score, 1370, 40);

  
  if(gameState === PLAY){
    balloon.changeAnimation("hotAirBalloon", balloon_moving);

    if(keyDown(LEFT_ARROW)){
      updateHeight(-10,0);
    }
    else if(keyDown(RIGHT_ARROW)){
      updateHeight(10,0);
    }
    else if(keyDown(UP_ARROW)){
      updateHeight(0,-10);
      balloon.scale=balloon.scale -0.005;
    }
    else if(keyDown(DOWN_ARROW)){
      updateHeight(0,+10);
      balloon.scale=balloon.scale+0.005;
    }

    balloon.setCollider("rectangle", 0, 0, 200, 500);
    spawnRocks();

    if(balloon.isTouching(rockGroup)){
      loseSound.play();
      gameState = END;
    }

    if(balloon.isTouching(pointGroup)){
      pointGroup.destroyEach();
      score = score + 1;
      point = new spawnPoint();
      scoreSound.play();
    }
  }

  if(gameState === END){
    rockGroup.setVelocityEach(0);
    rockGroup.destroyEach();
    pointGroup.destroyEach();
    balloon.changeAnimation("stop", balloon_stop);
    fill(0);
    textSize(25);
    textFont('helvetica');
    text("Game Over!", 660, 250);
    text("Press 'space' to play again!", 590, 280);
    
    

    if(keyDown("SPACE")){
      gameState = PLAY;
      score = 0;
      point = new spawnPoint();
    }
  }

  drawSprites();
}


function updateHeight(x,y){
  database.ref('balloon/height').set({
    'x': height.x + x ,
    'y': height.y + y
  })
}

function readHeight(data){
  height = data.val();
  console.log(height.x);
  balloon.x = height.x;
  balloon.y = height.y;
}

function showError(){
  console.log("Error in writing to the database");
}

function spawnRocks(){
  if(frameCount % 125 === 0){
    var rock = createSprite(1490, 350, 10, 10);
    rock.addAnimation("moving", rockImage);
    rock.y = Math.round(random(50, 700));
    rock.velocityX = -(7 + score/5);
    rock.scale = 0.15;
    if(score > 0 && score <= 4){
      rock.scale;
    } else if(score >=5 && score <= 9){
      rock.scale = rock.scale + 0.025;
    } else if(score >=10 && score <= 14){
      rock.scale = rock.scale + 0.05;
    } else if(score >=15 && score <= 19){
      rock.scale = rock.scale + 0.075;
    } else if(score >=20 && score <= 24){
      rock.scale = rock.scale + 0.1;
    } else if(score >=25 && score <= 29){
      rock.scale = rock.scale + 0.125;
    } else if(score >=30 && score <= 34){
      rock.scale = rock.scale + 0.15;
    } else if(score >=35 && score <= 39){
      rock.scale = rock.scale + 0.175;
    } else if(score >=40 && score <= 44){
      rock.scale = rock.scale + 0.2;
    } else if(score >=45 && score <= 49){
      rock.scale = rock.scale + 0.225;
    }

    rock.lifetime = 250;

    rockGroup.add(rock);
  }
}

function spawnPoint(){
  var point = createSprite(200, 200, 10, 10);
  point.addImage(pointImg);
  point.x = Math.round(random(0, 1500));
  point.y = Math.round(random(0, 700));
  point.scale = 1;

  pointGroup.add(point);
}
