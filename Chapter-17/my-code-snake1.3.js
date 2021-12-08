// Настройка «холста»
      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");






      // Получаем ширину и высоту элемента canvas

      var width = canvas.width;

      var height = canvas.height;







      // Вычисляем ширину и высоту в ячейках

      var blockSize = 10;

      var blockInWidth = width / blockSize;
      var blockInHeight = height / blockSize;








      // Устанавливаем счет 0

      var score = 0;







      // Рисуем рамку

      var drawBorder = function() {
        ctx.fillStyle = "grey";
        ctx.rect(0, 0, width, blockSize);
        ctx.rect(0, height - blockSize, width, blockSize);
        ctx.rect(0, 0, blockSize, height);
        ctx.rect(width - blockSize, 0, blockSize, height);
      }






      // Выводим счет игры в левом верхнем углу
      var drawScore = function(score) {
        ctx.font = "20px Courier";
        ctx.fillStyle = "Black";
        ctx.textAlign = "left";
        ctx.textBaseline = "up";
        ctx.fillText("the score is: " + score, blockSize, blockSize);
      }









      // Отменяем действие setInterval и печатаем сообщение «Конец игры»
      var gameOver = function() {
        clearInterval(intervalID);
        ctx.fillStyle = "black";
        ctx.font = '60px serif';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText("gameOver", width/2, height/2);
      }








      // Рисуем окружность (используя функцию из главы 14)
        var circle = function (x, y, radius, fillCircle) {

          ctx.beginPath();

          ctx.arc(x, y, radius, 0, Math.PI * 2, false);
          if (fillCircle) {
            ctx.fill();

          } else {
            ctx.stroke();
          }

        };













      // Задаем конструктор Block (ячейка)
      var Block = function(col, row){
        this.col = col;
        this.row = row;
      }












      // Рисуем квадрат в позиции ячейки
      Block.prototype.drawRectangle = function(color){
        var x = this.col * blockSize;
        var y = this.row * blockSize;
        ctx.fillStyle = color;
        ctx.rect(x, y, blockSize, blockSize);
        ctx.fill();
      };

      //var block = new Block(10, 10);
      //block.rectanglePartOfSnake("blue");















      // Рисуем круг в позиции ячейки
      Block.prototype.drawCircleApple = function(color) {
        var centerX = this.col * blockSize + blockSize/2;
        var centerY = this.row * blockSize + blockSize/2;
        ctx.fillStyle = color;
        circle(centerX, centerY, blockSize/2, true);
      };
      //Block.drawCircleApple("blue")









      // Проверяем, находится ли эта ячейка в той же позиции, что и ячейка 
      // otherBlock
      Block.prototype.checkIsTwoBlocksInOneBlock = function( otherBlock ) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
      };









      // Задаем конструктор Snake (змейка)
      var Snake = function(){

        this.segments = [
          new Block(7, 5),
          new Block(6, 5),
          new Block(5, 5)
        ];

        this.direction = "right";
        this.newDirection = "right";
      };






      // Рисуем квадратик для каждого сегмента тела змейки
      Snake.prototype.drawSnake = function(){
        for (var i = 0; i < this.segments.length; i++) {
          this.segments[i].drawRectangle("blue");
        }
      };










      // Создаем новую голову и добавляем ее к началу змейки,
      // чтобы передвинуть змейку в текущем направлении
      Snake.prototype.move = function() {
        var snakeHead = this.segments[0];
        var newHead;
        this.direction = this.newDirection;


        if (this.direction === "left") {
          newHead = new Block(snakeHead.col - 1, snakeHead.row);
        } else if (this.direction === "up") {
          newHead = new Block(snakeHead.col, snakeHead.row - 1);
        } else if (this.direction === "right") {
          newHead = new Block(snakeHead.col + 1, snakeHead.row);
        } else if (this.direction === "down") {
          newHead = new Block(snakeHead.col, snakeHead.row + 1);
        }




        if(this.checkIsHeadCollisionToBorderAndSnake(snakeHead)) {
          gameOver();

          return;
        };


        this.segments.unshift(newHead);


        if ( apple.position.checkIsTwoBlocksInOneBlock(newHead) ) {
          score++;
          apple.RandomPosition();
        } else { 
          this.segments.pop();
        };
      }








      // Проверяем, не столкнулась ли змейка со стеной или собственным 
      // телом
      Snake.prototype.checkIsHeadCollisionToBorderAndSnake = function(snakeHead) {
        var leftCollision = snakeHead.col === 0;
        var TopCollision = snakeHead.row === 0;
        var rightCollision = snakeHead.col === blockInWidth - 1;
        var BottomCollision = snakeHead.row === blockInHeight - 1;
        var wallCollision = leftCollision || TopCollision || rightCollision || BottomCollision;


        var selfCollision = false;
        for ( var j = 1 ; j < this.segments.length ; j++ ) {
          if ( snakeHead.checkIsTwoBlocksInOneBlock(this.segments[j]) ) {
            selfCollision = true;
          }
        }

        return wallCollision || selfCollision;
      }











      // Задаем следующее направление движения змейки на основе нажатой 
      // клавиши
      Snake.prototype.setDirection = function(directionEvent) {
        if (directionEvent === "left" && this.direction === "right") {
          return;
        }
        if (directionEvent === "up" && this.direction === "down") {
          return;
        }
        if (directionEvent === "right" && this.direction === "left") {
          return;
        }
        if (directionEvent === "down" && this.direction === "up") {
          return;
        }

        this.newDirection = directionEvent;
      };












      // Задаем конструктор Apple (яблоко)
      var Apple = function() {
        this.position = new Block(10, 10);
      };












      // Рисуем кружок в позиции яблока
      Apple.prototype.draw = function() {
        this.position.drawCircleApple("LimeGreen");
      };












      // Перемещаем яблоко в случайную позицию
      Apple.prototype.RandomPosition = function() {
        var randomCol = Math.floor(Math.random() * (blockInWidth - 2)) + 1;
        var randomRow = Math.floor(Math.random() * (blockInHeight - 2)) + 1;

        this.position = new Block(randomCol, randomRow);
      };













      // Создаем объект-змейку и объект-яблоко
      var apple = new Apple();
      var snake = new Snake();














      // Запускаем функцию анимации через setInterval
      var intervalID = setInterval(function() {
        ctx.clearRect(0, 0, width, height);
        drawScore(score);
        snake.move();
        snake.drawSnake();
        apple.draw();
        drawBorder();
      }, 100);














      // Преобразуем коды клавиш в направления
//////////////////////////////////howCreateMassiveKeyProperty/////////////////////https://otus.ru/nest/post/1301/
      var arrayKeyCodesToString = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
      };














      // Задаем обработчик события keydown (клавиши-стрелки)
      document.addEventListener('keydown', function(event) {
        directionEvent = arrayKeyCodesToString[event.keyCode];
        if (true) {
          snake.setDirection(directionEvent);
        }
      });