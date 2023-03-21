var trex, trexImg, trexCollided;
var chao;
var chaoImg;
var chaoFake;
var nuvem, nuvemImage;
var score = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var grupoCacto;
var grupoNuvem;

var jumpSound, dieSound, scoreSound;

function preload() {
  //carrega imagens, animações, sons etc...
  trexImg = loadAnimation("trex3.png", "trex4.png");
  chaoImg = loadImage("ground2.png");
  nuvemImage = loadImage("cloud.png");

  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");

  trexCollided = loadAnimation("trex_collided.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  scoreSound = loadSound("checkPoint.mp3");
}

function setup() {
  //função de configuração
  createCanvas(600, 200);

  trex = createSprite(50, 170);
  trex.addAnimation("running", trexImg);
  trex.addAnimation("F", trexCollided);
  trex.scale = 0.5;

  //mostrar a hitbox do dino
  trex.debug = false;

  trex.setCollider("circle", -10, 5, 30);

  chao = createSprite(300, 190, 600, 20);
  chao.x = chao.width / 2;
  chao.addImage(chaoImg);
  chao.velocityX = -(5 + score / 100);

  chaoFake = createSprite(300, 200, 600, 20);
  chaoFake.visible = false;

  grupoCacto = new Group();
  grupoNuvem = new Group();

  // var rand = Math.round(random(1, 10));
  // console.log(rand);
}

function draw() {
  background("white");

  textFont("fantasy");
  textSize(20);
  text("Score: " + score, 480, 30);

  if (gameState === PLAY) {
    score = score + Math.round(frameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      scoreSound.play();
    }

    if (keyDown("space") && trex.isTouching(chao)) {
      trex.velocityY = -15;
      jumpSound.play();
    }

    //gravidade
    trex.velocityY = trex.velocityY + 0.9;

    //chao infinito
    if (chao.x < 0) {
      chao.x = chao.width / 2;
    }

    gerarNuvens();

    obstacles();

    if (trex.isTouching(grupoCacto)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    grupoCacto.setVelocityXEach(0);
    grupoNuvem.setVelocityXEach(0);
    chao.velocityX = 0;

    grupoCacto.setLifetimeEach(-1);
    grupoNuvem.setLifetimeEach(-1);

    trex.velocityY = 0;
    trex.velocityX = 0;

    trex.changeAnimation("F");
  }

  trex.collide(chaoFake);

  drawSprites();
}

function gerarNuvens() {
  if (frameCount % 60 === 0) {
    nuvem = createSprite(620, Math.round(random(50, 150)), 10, 10);
    nuvem.velocityX = -3;
    nuvem.addImage(nuvemImage);
    nuvem.scale = 0.5;
    nuvem.lifetime = 220;

    //depth significa camada
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;

    grupoNuvem.add(nuvem);
  }
}

function obstacles() {
  if (frameCount % 60 === 0) {
    cacto = createSprite(620, 175, 30, 30);
    cacto.velocityX = -(5 + score / 100);

    var num = Math.round(random(1, 6));

    switch (num) {
      case 1:
        cacto.addImage(obs1);
        break;
      case 2:
        cacto.addImage(obs2);
        break;
      case 3:
        cacto.addImage(obs3);
        break;
      case 4:
        cacto.addImage(obs4);
        break;
      case 5:
        cacto.addImage(obs5);
        break;
      case 6:
        cacto.addImage(obs6);
        break;
    }

    cacto.scale = 0.5;
    cacto.lifetime = 130;

    cacto.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //o grupo de cactos adiciona o cacto
    grupoCacto.add(cacto);
  }
}
