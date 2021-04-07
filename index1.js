const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const intro = document.getElementById("intro");
const board = document.getElementById("board");
const count = document.getElementById("counter");
const over = document.getElementById("game-over");


const caracter = new Image();
caracter.src = "./assets/images/ship.png";


const canvasBackground = new Image();
canvasBackground.src = "./assets/images/scenario.png";
canvasBackground.width=500;
canvasBackground.height=600;


const sandImg = new Image();
sandImg.src = "./assets/images/sand-bank2.png";


const oilImg = new Image();
oilImg.src = "./assets/images/barril-oil.png";



const overAudio = new Audio();
overAudio.src = "./assets/audio/total-fail.mp3";
overAudio.volume = 0.2;

const startAudio = new Audio();
startAudio.src = "./assets/audio/5boat.wav";
startAudio.volume = 0.2;

const hitAudio = new Audio();
hitAudio.src = "./assets/audio/audio_hit.mp3";
hitAudio.volume = 0.2;

const winAudio = new Audio();
winAudio.src = "./assets/audio/audio_win.mp3";
winAudio.volume = 0.2;

const crashSound = new Audio();
crashSound.src="./assets/audio/total-fail.mp3";
crashSound.volume= 0.2;

class Component {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      // this.speed = speed;
      this.speedX=0;
      this.speedY=0;
    }

    updatePosition() {
      this.x += this.speedX;
  
    }
  
    left() {
      return this.x;
    }
  
    right() {
      return this.x + this.width;
    }
  
    top() {
      return this.y;
    }
  
    bottom() {
      return this.y + this.height;
    }
  
    isCrashedWith(obj) {
      const condition = !(
        this.bottom() < obj.top() ||
        this.top() > obj.bottom() ||
        this.right() < obj.left() ||
        this.left() > obj.right()
      );
  
      return condition;
    }
  }

  class BackgroundImage extends Component {
    constructor(x, y, width, height) {
      super(x, y, width, height);
      this.speedY = 2;
    }
  
    updatePosition() {
      this.y += this.speedY;
      this.y %= canvas.height;
    }
  
    draw() {    // funcao para o rolamento do cenario
      ctx.drawImage(canvasBackground, 0, this.y, this.width, this.height);
      ctx.drawImage(canvasBackground, 0, this.y - canvas.height+5, this.width, this.height);
    }
  }
  

  class SandBank extends Component {
    move() {
      this.y += this.speedY;
    }
  
    draw() {
      ctx.drawImage(sandImg, this.x, this.y, 20, 20);
    }
  }

  class OilBarrel extends Component {
    move() {
      this.y += this.speedY;
    }
  
    draw() {
      ctx.drawImage(oilImg, this.x, this.y, 17, 30);
    }
  }

  class Game {
    constructor(player, BackgroundImg) {
      this.player = player;
      this.animationId;
      this.frames = 0;
      this.frames2 = 0;
      this.sand = [];
      this.oil = [];
      this.collection = [];
      this.BackgroundImg = BackgroundImg;
    }
  
    updateGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0099ff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      this.BackgroundImg.updatePosition()
      this.BackgroundImg.draw()

      this.player.move();
      this.player.draw();

    
  
      this.updateSand();
  
      this.updateOil();
  
      this.checkOilCrash();
  
      this.animationId = requestAnimationFrame(this.updateGame);
  
      this.checkGameOver();
  
      this.checkGameWin();
    };
  
    updateSand = () => {    // bancos de areia
      this.frames2++;
  
      this.sand.map((sand) => {
        console.log(sand.speedY)
        
        sand.move();
        sand.draw();
      });
  
      if (this.frames2 % 280 === 0) {
        let y = 0;
  
        let minX = 160;
        let maxX = canvas.width - 200;
        let x = Math.floor(Math.random() * (maxX - minX + 1) + minX);
  
        const sand = new SandBank(x, y, 10, 10);
        sand.speedY=3;
        this.sand.push(sand);
      }
    };
  
    updateOil = () => {           // barris de oleo
      this.frames++;
  
      this.oil.map((oil) => {
        oil.move();
        oil.draw();
      });
  
      if (this.frames % 350 === 0) {    // a cada 190 frames aparece um barril
        let y = 0;
  
        let minX = 170;
        let maxX = canvas.width - 190;
        let x = Math.floor(Math.random() * (maxX - minX + 1) + minX);
  
        const oil = new OilBarrel(x, y, 10, 20);
        oil.speedY=3;  // incrementa velocidade no eixo y
        this.oil.push(oil);
      }
    };
  
    checkGameOver = () => {            // checar GAME OVER! COLISAO COM BANCO DE AREIA!
      const crashed = this.sand.some((sand) => {
        return this.player.isCrashedWith(sand);
      }); 
      
  
      if (crashed) {
        crashSound.play();
        cancelAnimationFrame(this.animationId);
  
        over.style.display = "block";
        board.style.display = "none";
      }
    };
  
    checkOilCrash = () => {
      const crash = this.oil.some((oil) => {
        return this.player.isCrashedWith(oil);
      });
  
      //Incrementar o contador de barris
      if (crash) {
        let actualOil = this.oil.splice(0, 1)[0];
        let collided = actualOil.isCrashedWith(this.player);
  
        if (collided) {
          this.collection.push(actualOil);
          hitAudio.play();
  
        }
  
        
  
        if (this.collection.length < 10) {      // para deixar o count com 2 digitos
          count.innerText = "0" + this.collection.length;
        } else {
          count.innerText = this.collection.length;
        }
      }
    };
  
    checkGameWin = () => {
      if (this.collection.length === 10) {   //verifica a qntidade de barris coletados
        winAudio.play()
        cancelAnimationFrame(this.animationId);
        win.style.display = "block";
        board.style.display = "none";
        over.style.display = "none";
      }
    };
  }


class Player extends Component {
    move() {
      this.x += this.speedX;
  
      if (this.x <= 150) {
        this.x = 150;
      }
  
      if (this.x >= canvas.width - 240) {   // delimita os limites do canal
        this.x = canvas.width - 240;
      }
      this.y += this.speedY;
    }
  
    draw() {
      ctx.imageSmoothingQuality = "high";
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(caracter, this.x+20, this.y-50, 40, 180);
    }
  }
  
  
  window.onload = () => {
    document.getElementById("play").onclick = () => {
    startAudio.play();
      startGame(Player);
    };
  
  
  };

   function startGame(caracter) {
      intro.style.display = "none";
      board.style.display = "block";
  
      const game = new Game(
        new caracter(
          canvas.width / 2 - 40,
          canvas.height - 137,
          80,
          137,
          0
        ),

        new BackgroundImage(0,0,canvas.width,canvas.height)
      
      );
  
      game.updateGame();
  
      document.addEventListener("keydown", (event) => {
        console.log(game)
        if (event.code === "ArrowLeft") {
          game.player.speedX = -3;
        } else if (event.code === "ArrowRight") {
          game.player.speedX = 3;
        }
      });
    
      document.addEventListener("keyup", () => {
    
        game.player.speedX = 0;
      });
    }