const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let overlapping;
let count = 0;

//隨機整數，取得介於min~max之間的數
function getRandomArbitary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }
  drawBrick() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

//製作所有的brick
for (let i = 0; i < 10; i++) {
  new brick(getRandomArbitary(0, 950), getRandomArbitary(0, 550));

  //磚塊不要重疊
  overlapping = false;
  for (let j = 0; j < i; j++) {
    do {
      brickArray[i].x = getRandomArbitary(0, 950);
      brickArray[i].y = getRandomArbitary(0, 550);
      checkOverlapping(brickArray[i], brickArray[j]);
    } while (overlapping);
  }
}

function checkOverlapping(new_brick, other_brick) {
  if (
    (!(
      new_brick.x <= other_brick.x + other_brick.width &&
      new_brick.x >= other_brick.x
    ) &&
      !(
        new_brick.y <= other_brick.y + other_brick.height &&
        new_brick.y >= other_brick.y
      )) ||
    (!(
      new_brick.x + new_brick.width <= other_brick.x + other_brick.width &&
      new_brick.x + new_brick.width >= other_brick.x
    ) &&
      !(
        new_brick.y <= other_brick.y + other_brick.height &&
        new_brick.y >= other_brick.y
      )) ||
    (!(
      new_brick.y + new_brick.height <= other_brick.y + other_brick.height &&
      new_brick.y + new_brick.height >= other_brick.y
    ) &&
      !(
        new_brick.x <= other_brick.x + other_brick.width &&
        new_brick.x >= other_brick.x
      )) ||
    (!(
      new_brick.x + new_brick.width <= other_brick.x + other_brick.width &&
      new_brick.x + new_brick.width >= other_brick.x
    ) &&
      !(
        new_brick.y + new_brick.height <= other_brick.y + other_brick.height &&
        new_brick.y + new_brick.height >= other_brick.y
      ))
  ) {
    console.log("safe");
    overlapping = false;
    return;
  } else {
    console.log(
      new_brick.x +
        " ," +
        new_brick.y +
        "和" +
        other_brick.x +
        "," +
        other_brick.y +
        "重疊"
    );
    overlapping = true;
    return;
  }
}

//將滑鼠附加在canvas上面，滑鼠在canvas裡的時候才可以移動地板
c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX - 100;
});

//畫彈跳球
function drawCircle() {
  //是否打到磚塊
  brickArray.forEach((brick, index) => {
    if (brick.visible == true && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      //改變x,y方向速度，並且讓brick從brickArray移走
      //從下方撞擊或是從上方撞擊，改變球的y方向
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
      }
      //從左方撞擊或從右方撞擊，改變球的x方向
      else if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }
      //刪掉磚塊
      //因為是從brickArray畫的，所以刪掉brickArray的東西，就會直接不見

      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });
  //確認球是否打到橘色地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    //增加彈力，避免球的y座標一直卡在這個區間內，看起來像是卡在線裡面
    if (ySpeed > 0) {
      circle_y -= 50;
    } else {
      circle_y += 50;
    }
    ySpeed *= -1;
  }
  //更動圓形位置，確認球有沒有打到上下左右邊界
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }
  if (circle_y <= radius) {
    ySpeed *= -1;
  }
  circle_x += xSpeed;
  circle_y += ySpeed;

  //畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出所有的brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出可控制的地板
  ctx.fillStyle = "blue";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //畫出圓球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
