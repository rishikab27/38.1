var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudGroup, cloudImage;
var obs,obs1,obs2,obs3,obs4,obs5,obs6,obsGroup
var score=0 
var PLAY=1
var END=0
var gameState=PLAY
var restart,restartImage
var gameOver, gameOverImage
var jump, die, checkpoint

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obs1=loadImage("obstacle1.png")
  obs2=loadImage("obstacle2.png")
  obs3=loadImage("obstacle3.png")
  obs4=loadImage("obstacle4.png")
  obs5=loadImage("obstacle5.png")
  obs6=loadImage("obstacle6.png")
  restartImage=loadImage("restart.png")
  gameOverImage=loadImage("gameOver.png")
  jump=loadSound("jump.mp3")
  die=loadSound("die.mp3")
  checkpoint=loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  //trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  //grounder
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  cloudGroup=createGroup()
  obsGroup=createGroup()
  
  restart=createSprite(300,120,10,10)
  gameOver=createSprite(300,90,10,10)
  
  restart.addImage("restarT",restartImage)
  restart.scale=(0.5)
  restart.visible=false;
  gameOver.addImage("gameee",gameOverImage)
  gameOver.scale=(0.5)
  gameOver.visible=false;
  
  //colider
  trex.setCollider("rectangle",0,0,80,80)
  
  
}

function draw() {
  background(180);
  
//game state
  if(gameState===PLAY){
    //velocity 
    trex.velocityX = 2
    trex.velocityY = trex.velocityY + 0.8
    
    // making it false
    restart.visible=false;
    gameOver.visible=false;
    
    //score how its counted 
    score=score+1
    
    //trex running
    trex.changeAnimation("running", trex_running);
    
    //trex jump 
    if(keyDown("space")&& trex.y >= 160) {
      trex.velocityY = -15; 
      jump.play()
    }
    
    //loop for ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //spawn the clouds
      spawnClouds();
    
    //spawn the obs
      spawnOb();
    if(score%300===0 && score>0){
      checkpoint.play()
    }
    //end game state
    if(obsGroup.isTouching(trex)){
      die.play()
      gameState=END
    }
  }
  else if(gameState===END){
    //velcoity is now 0
    trex.velocityY=0
    ground.velocityX=0
    trex.velocityX=0
    cloudGroup.setVelocityXEach(0);
    obsGroup.setVelocityXEach(0);
    
    //you are now visble
    restart.visible=true;
    gameOver.visible=true;
     
    //boom you different
    trex.changeAnimation("collided",trex_collided)
    
    //you haven't disapeared from the world
    obsGroup.setLifetimeEach(-1)
    cloudGroup.setLifetimeEach(-1)
    
    if(mousePressedOver(restart)){
      reset(); 
    }   
  }
  
//score  
  fill("black")
  textSize(15)
  text("Score: "+score,500,20)
  
// for trex to stay on ground
  trex.collide(invisibleGround);
  
  camera.position.x = trex
  drawSprites();
}

function spawnClouds() {
  //frame thing
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
  
    
    
    //assigning lifetime to the variable
    cloud.lifetime = 200
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    cloudGroup.add(cloud)
    }
}

function spawnOb(){
  if(frameCount% 80===0){                                       
    obs=createSprite(600,170,10,10)
    obs.velocityX =-(6+score/100)
    var num=Math.round(random(1,6))
    switch(num){
      case 1:obs.addImage(obs1)
        break
      case 2:obs.addImage(obs2)
        break
      case 3:obs.addImage(obs3)
        break
      case 4:obs.addImage(obs4)
        break
      case 5:obs.addImage(obs5)
        break
      case 6:obs.addImage(obs6)
        break
        default:break
          }
        obs.scale=0.5
        obs.lifetime=150
        obsGroup.add(obs)
  }
}
  
function reset(){
  gameState=PLAY
  score=0
  obsGroup.destroyEach();
  cloudGroup.destroyEach();
}
  
