var game = {
  // 启动游戏时，data是个二维数组，存储了每个格子里的数字
  data: [],
  // 总行数  
  RN: 4,
  // 总列数
  CN: 4,
  // 分数
  score: 0,

  // 初始化
  init: function () {
    this.oScore = document.getElementsByClassName('score')[0];
    this.oResetBtn = document.getElementsByClassName('resetBtn')[0];
    console.log(this.oScore);
    // 初始化一个总行数为RN，总列数为CN的二维数组，各个元素都为0
    for (var r = 0; r < this.RN; r++) {
      this.data[r] = [];
      for (var c = 0; c < this.CN; c++) {
        // 每个元素值为0
        this.data[r][c] = 0;
      }
    }
    // 随机生成两个数
    this.randomNum();
    this.randomNum();
    // 将data中的数据更新到页面中
    this.updataView();

    this.handleRestart();
  },
  // 2.随机生成一个数字,2或4
  randomNum: function () {
    if (!this.isFull()) {
      while (true) {
        // Math.random()*(max-min+1)+min [0,3]
        var r = parseInt(Math.random() * this.RN);
        var c = parseInt(Math.random() * this.CN);
        if (this.data[r][c] === 0) {
          this.data[r][c] = Math.random() < 0.5 ? 2 : 4;
          break;
        }
      }
    }
  },
  // 3.判断数组是否满员
  isFull: function () {
    for (var r = 0; r < this.data.length; r++) {
      for (var c = 0; c < this.data[r].length; c++) {
        if (this.data[r][c] == 0) {
          return false;
        }
      }
    }
    return true;
  },
  // 4.将data中得每个元素值渲染到页面中
  updataView: function () {
    for (var r = 0; r < this.data.length; r++) {
      for (var c = 0; c < this.data[r].length; c++) {
        var div = document.getElementById("c" + r + c);
        if (this.data[r][c] != 0) {
          div.innerHTML = this.data[r][c];
          div.className = "cell n" + this.data[r][c];
        }
        else {
          div.innerHTML = "";
          div.className = "cell";
        }
      }
    }
  },
  // 5.左移
  moveLeft: function () {
    // 在移动之前先以字符串形式保存画面
    var before = this.data.toString();
    for (var r = 0; r < this.data.length; r++) {
      this.moveLeftInRow(r);
    }
    // 在移动后再保存一个画面
    var after = this.data.toString();
    if (before != after) {
      this.randomNum();
      this.updataView();
      this.updataScore();
    }
  },
  // 5-1.单行左移
  moveLeftInRow: function (r) {
    for (var c = 0; c < this.data[r].length - 1; c++) {
      // 从c开始，找下一个不为零的位置下标next
      var next = this.getRightNext(r, c);
      if (next == -1) {
        break;
      } else {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[r][next];
          this.data[r][next] = 0;
          // c左移一位
          c--;
        } else if (this.data[r][c] == this.data[r][next]) {
          this.data[r][c] *= 2;
          this.data[r][next] = 0;
        }
      }
    }
  },
  // 5-2.获取右侧下一个不为零的元素的下标
  getRightNext: function (r, c) {
    for (var next = c + 1; next < this.data[r].length; next++) {
      if (this.data[r][next] != 0) {
        return next;
      }
    }
    return -1;
  },
  // 6.右移
  moveRight: function () {
    // 在移动之前先以字符串形式保存画面
    var before = this.data.toString();
    for (var r = 0; r < this.data.length; r++) {
      this.moveRightInRow(r);
    }
    // 在移动后再保存一个画面
    var after = this.data.toString();
    if (before != after) {
      this.randomNum();
      this.updataView();
      this.updataScore();
    }
  },
  // 6-1.单行右移
  moveRightInRow: function (r) {
    for (var c = this.data[r].length - 1; c > 0; c--) {
      // 从c开始，找下一个不为零的位置下标prev
      var prev = this.getLeftPrev(r, c);
      if (prev == -1) {
        break;
      } else {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[r][prev];
          this.data[r][prev] = 0;
          // c右移一位
          c++;
        }
        else if (this.data[r][c] == this.data[r][prev]) {
          this.data[r][c] *= 2;
          this.data[r][prev] = 0;
        }
      }
    }
  },
  // 6-2.获得左侧上一个不为零的元素的下标
  getLeftPrev: function (r, c) {
    for (var prev = c - 1; prev >= 0; prev--) {
      if (this.data[r][prev] != 0) {
        return prev;
      }
    }
    return -1;
  },
  // 7.上移
  moveUp: function () {
    // 在移动之前先以字符串形式保存画面
    var before = this.data.toString();
    for (var c = 0; c < this.CN; c++) {
      this.moveUpInCol(c);
    }
    // 在移动后再保存一个画面
    var after = this.data.toString();
    if (before != after) {
      this.randomNum();
      this.updataView();
      this.updataScore();
    }
  },
  // 7-1.单列上移
  moveUpInCol: function (c) {
    for (var r = 0; r < this.data.length; r++) {
      // 找下方下一个不为0的数的下标，保存down中
      var down = this.getDownNext(r, c);
      if (down == -1) {
        break;
      } else {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[down][c];
          this.data[down][c] = 0;
          // r向上移一位
          r--;
        } else if (this.data[r][c] == this.data[down][c]) {
          this.data[r][c] *= 2;
          this.data[down][c] = 0;
        }
      }
    }
  },
  // 7-2.获得下方下一个不为零的元素的下标
  getDownNext: function (r, c) {
    for (var downR = r + 1; downR < this.data.length; downR++) {
      if (this.data[downR][c] != 0) {
        return downR;
      }
    }
    return -1;
  },
  // 8.下移
  moveDown: function () {
    // 在移动之前先以字符串形式保存画面
    var before = this.data.toString();
    for (var c = 0; c < this.CN; c++) {
      this.moveDownInRow(c);
    }
    // 在移动后再保存一个画面
    var after = this.data.toString();
    if (before != after) {
      this.randomNum();
      this.updataView();
      this.updataScore();
    }
  },
  // 8-1.单列下移
  moveDownInRow: function (c) {
    for (var r = this.data.length - 1; r >= 0; r--) {
      // 找下方下一个不为0的数的下标，保存prev中
      var prev = this.getUpPrev(r, c);
      if (prev == -1) {
        break;
      } else {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[prev][c];
          this.data[prev][c] = 0;
          // r向下移一位
          r++;
        } else if (this.data[r][c] == this.data[prev][c]) {
          this.data[r][c] *= 2;
          this.data[prev][c] = 0;
        }
      }
    }
  },
  // 8-2.获得上方上一个不为零的元素的下标
  getUpPrev: function (r, c) {
    for (var upPrev = r - 1; upPrev >= 0; upPrev--) {
      if (this.data[upPrev][c] != 0) {
        return upPrev;
      }
    }
    return -1;
  },

  updataScore: function () {
    this.score++;
    this.oScore.innerText = this.score;
  },

  handleRestart() {
    this.oResetBtn.onclick = () => {
      window.location.reload();
    };
  },
}
// 9.网页加载完成后，立刻执行的操作
window.onload = function () {
  game.init();
  // 当按键按下时
  document.onkeydown = function () {
    // 获取事件对象
    var e = window.event || arguments[0];
    if (e.keyCode == 37) {
      // 37 向左方向键
      game.moveLeft();
    } else if (e.keyCode == 38) {
      // 38 向上方向键
      game.moveUp();
    } else if (e.keyCode == 39) {
      // 39 向右方向键
      game.moveRight();
    } else if (e.keyCode == 40) {
      // 40 向下方向键
      game.moveDown();
    }
  }
}