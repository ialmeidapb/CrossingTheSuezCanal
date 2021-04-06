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
hitAudio.src = "/assets/audio/audio_hit.mp3";
hitAudio.volume = 0.2;



class Component {
    constructor(x, y, width, height, speed) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
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

  class SandBank extends Component {
    move() {
      this.y += this.speed;
    }
  
    draw() {
      ctx.drawImage(sandImg, this.x, this.y, 35, 35);
    }
  }

  class OilBarrel extends Component {
    move() {
      this.y += this.speed;
    }
  
    draw() {
      ctx.drawImage(oilImg, this.x, this.y, 17, 30);
    }
  }

  class Game {
    constructor(player) {
      this.player = player;
      this.animationId;
      this.frames = 0;
      this.frames2 = 0;
      this.sand = [];
      this.oil = [];
      this.collection = [];
    }
  
    updateGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1C212E";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        canvasBackground,
        0,
        0,
        canvasBackground.width,
        canvasBackground.height
      );
  
      this.player.move();
      this.player.draw();
  
      this.updateSand();
  
      this.updateOil();
  
      this.checkOilCrash();
  
      this.animationId = requestAnimationFrame(this.updateGame);
  
      this.checkGameOver();
  
      this.checkGameWin();
    };
  
    updateSand = () => {
      this.frames2++;
  
      this.sand.map((sand) => {
        sand.move();
        sand.draw();
      });
  
      if (this.frames2 % 67 === 0) {
        let y = 0;
  
        let minX = 0;
        let maxX = canvas.width - 20;
        let x = Math.floor(Math.random() * (maxX - minX + 1) + minX);
  
        const sand = new Sand(x, y, 20, 20, 3);
  
        this.sand.push(sand);
      }
    };
  
    updateOil = () => {
      this.frames++;
  
      this.oil.map((oil) => {
        oil.move();
        oil.draw();
      });
  
      if (this.frames % 80 === 0) {
        let y = 0;
  
        let minX = 5;
        let maxX = canvas.width - 30;
        let x = Math.floor(Math.random() * (maxX - minX + 1) + minX);
  
        const oil = new Oil(x, y, 10, 20, 3);
  
        this.oil.push(oil);
      }
    };
  
    checkGameOver = () => {
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
        }
  
        hitAudio.play();
  
        switch (this.collection.length) {
          case 3:
            months.innerText = "1/11";
            break;
          case 5:
            months.innerText = "2/11";
            break;
          case 7:
            months.innerText = "3/11";
            break;
          case 9:
            months.innerText = "4/11";
            break;
          case 11:
            months.innerText = "5/11";
            break;
          case 13:
            months.innerText = "6/11";
            break;
          case 15:
            months.innerText = "7/11";
            break;
          case 17:
            months.innerText = "8/11";
            break;
          case 19:
            months.innerText = "9/11";
            break;
          case 21:
            months.innerText = "10/11";
            break;
          case 23:
            months.innerText = "END";
        }
  
        if (this.collection.length < 10) {
          count.innerText = "0" + this.collection.length;
        } else {
          count.innerText = this.collection.length;
        }
      }
    };
  
    checkGameWin = () => {
      if (this.collection.length === 25) {
        hitAudio.play();
        cancelAnimationFrame(this.animationId);
        win.style.display = "block";
        board.style.display = "none";
        over.style.display = "none";
      }
    };
  }


class Player extends Component {
    move() {
      this.x += this.speed;
  
      if (this.x <= 0) {
        this.x = 0;
      }
  
      if (this.x >= canvas.width - 80) {
        this.x = canvas.width - 80;
      }
    }
  
    draw() {
      ctx.imageSmoothingQuality = "high";
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(caracter, this.x, this.y, 40, 180);
    }
  }
  
  
  window.onload = () => {
    document.getElementById("play").onclick = () => {
    startAudio.play();
      startGame(Player);
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
        )
      );
  
      game.updateGame();
  
      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          game.player.speed = -4;
        }
  
        if (event.key === "ArrowRight") {
          game.player.speed = 4;
        }
      });
  
      document.addEventListener("keyup", () => {
        game.player.speed = 0;
      });
    }
  };