(()=>{

    const init = () => {
        for (let i = 0; i < 400; i ++) {
            const div = document.createElement("div");
            document.querySelector(".game").append(div);
        }
        if (!localStorage.highscore) {
            localStorage.setItem("highscore", 0);
        }
        document.querySelector(".highscore").innerText = `HI: ${localStorage.highscore}`;
    }
    init();

    let gameMode = undefined;
    let gameOver = false;
    let gameWin = false;
    let speed = undefined;
    let score = 0;

    document.querySelectorAll(".menu div").forEach(button => {
        button.addEventListener("click", e => {
            gameMode = e.target.innerText.toLowerCase();
            if (gameMode === "easy") {
                speed = 7;
                foods.push(new Food());
                foods.push(new Food());
            } else {
                speed = 10
                foods.push(new Food());
            }
            document.querySelector(".menu").classList.add("menu--transparent");
        });
    });

    class Snake {
        constructor() {
            this.pos = 205;
            this.dir = 0;
            this.body = [];
            this.trail = [];
        }
        
        update() {
            if (this.body.includes(this.pos + this.dir)) {
                gameOver = true;
                return;
            }

            if (this.pos % 20 === 19 && this.dir === 1) {
                if (gameMode === "easy") {
                    this.pos -= 19;
                    return;
                } else {
                    gameOver = true;
                    return;
                }
            } else if (this.pos % 20 === 0 && this.dir === -1) {
                if (gameMode === "easy") {
                    this.pos += 19;
                    return;
                } else {
                    gameOver = true;
                    return;
                }
            } else if ([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].includes(this.pos) && this.dir === -20) {
                if (gameMode === "easy") {
                    this.pos += 380;
                    return;
                } else {
                    gameOver = true;
                    return;
                }
            } else if ([380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399].includes(this.pos) && this.dir === 20) {
                if (gameMode === "easy") {
                    this.pos -= 380;
                    return;
                } else {
                    gameOver = true;
                    return;
                }
            }
            this.pos += this.dir;
            this.body = [];
            for (let i = 0; i < score; i ++) {
                this.body.push(this.trail[this.trail.length - (1 + i)])
            }
            this.trail.push(this.pos);
        }

        draw() {
            document.querySelectorAll(".game div")[this.pos].classList.add("snake");
            this.body.forEach(position => {
                document.querySelectorAll(".game div")[position].classList.add("snake-body");
            })
        }
    }

    const snake = new Snake();

    class Food {
        constructor() {
            this.pos = 214;
        }

        update() {
            if (this.pos === snake.pos) {
                score ++;
                document.querySelector(".score").innerText = `Score: ${score}`;
                if (score > localStorage.highscore) {
                    localStorage.highscore = score;
                    document.querySelector(".highscore").innerText = `HI: ${localStorage.highscore}`;
                }
                if (score > 397) {
                    gameWin = true;
                }

                this.pos = Math.floor(Math.random()*(400 - score));
                while (this.pos === snake.pos || snake.body.includes(this.pos)) {
                    this.pos ++;
                }
            }
        }

        draw() {
            document.querySelectorAll(".game div")[this.pos].classList.add("food");
        }
    }

    let foods = [];

    document.addEventListener("keydown", e => {
        if (e.code === "ArrowUp" && snake.dir !== 20) {
            snake.dir = -20;
        } else if (e.code === "ArrowDown" && snake.dir !== -20) {
            snake.dir = 20;
        } else if (e.code === "ArrowRight" && snake.dir !== -1) {
            snake.dir = 1;
        } else if (e.code === "ArrowLeft" && snake.dir !== 1) {
            snake.dir = -1;
        }
    })

    const animate = () => {
        document.querySelectorAll(".game div").forEach(tile => {
            tile.classList.remove("snake");
            tile.classList.remove("snake-body");
            tile.classList.remove("food");
        });

        snake.update();
        snake.draw();
        foods.forEach(food => {
            food.update();
            food.draw();
        });
        if (!gameOver && !gameWin) {
            setTimeout(animate, 1000/speed);
        } else {
            document.querySelector(".game-over-screen p").innerText = gameWin ? "You Win!" : "Game Over!";
            document.querySelector(".game-over-screen").classList.add("game-over-screen--show-1");
            setTimeout(() => {
                document.querySelector(".game-over-screen").classList.add("game-over-screen--show-2")
            }, 1000);
        }
    }

    animate();

})();