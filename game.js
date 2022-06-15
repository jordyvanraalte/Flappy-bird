/**
 * The game class represents the whole game and contains all entities of flappy bird.
 */
class Game
{
    constructor() {
        this.scale = 1
        //under 1000 pixels it is considered a mobile device
        if(window.innerWidth < 1000)
        {
            this.scale = window.innerWidth / 500
            window.addEventListener("touchstart", this.touch.bind(this), { passive: false })
        }
        else {
            window.addEventListener('click', this.click.bind(this))
        }

        this.canvas = document.querySelector('canvas')
        this.canvas.width = 500 * this.scale
        this.canvas.height = 500 * this.scale
        this.canvas_ctx = this.canvas.getContext('2d')

        this.sound = new Sound()
        this.frameCount = 0
        this.pipes = []
        this.started = false
        this.gameover = false

        this.initializeSprites()
        this.initializeBird()
        this.initializeScore()
        this.initializeMenus()
        this.lastFrameTime = 0
        this.fps = 1000 / 60
        this.delta = 0
        this.lastPipeUpdate = 0
    }

    /**
     * Initializes all the sprites
     */
    initializeSprites()
    {

        let base = new Image()
        base.src = './assets/base.png'

        let backgroundDay = new Image()
        backgroundDay.src = './assets/background-day.png'

        let startingMessage = new Image()
        startingMessage.src = './assets/message.png'


        let message = new Sprite({
            position: {
                x: this.canvas.width / 2 - 184 / 2 * this.scale,
                y: this.canvas.height / 2 - 267 / 2 * this.scale
            },
            scale: this.scale,
            image: startingMessage,
        })

        let background1 = new Sprite({
            position: {
                x: 0,
                y: 0
            },
            scale: this.scale,
            image: backgroundDay,
        })

        let background2 = new Sprite({
            position: {
                x: 288 * this.scale,
                y: 0
            },
            scale: this.scale,
            image: backgroundDay,
        })

        let terrain1 = new Sprite({
            position: {
                x: 0,
                y: this.canvas.height - 70 * this.scale,
            },
            scale: this.scale,
            image: base,
        })

        let terrain2 = new Sprite({
            position: {
                x: 336,
                y: this.canvas.height - 70 * this.scale,
            },
            scale: this.scale,
            image: base,
        })

        this.background = [background1, background2]
        this.terrain = [terrain1, terrain2]
        this.message = message

        this.world = {
            minX: 0,
            maxX: this.canvas.width,
            minY: 0,
            maxY: this.canvas.height - 80 * this.scale
        }
    }

    /**
     * Initialize all bird components
     */
    initializeBird()
    {
        let down = new Image()
        down.src = './assets/bluebird-downflap.png'

        let mid = new Image()
        mid.src = './assets/bluebird-midflap.png'

        let up = new Image()
        up.src = './assets/bluebird-upflap.png'

        let images = [down, mid, up]

        this.bird = new Bird({
            position: {
                x: this.canvas.width / 2 - 100 * this.scale,
                y: this.canvas.height / 2 + 35 * this.scale
            },
            scale: this.scale,
            images: images,
            callback: this.birdEvent.bind(this)
        } )
    }

    /**
     * Initialize all the scores
     */
    initializeScore()
    {
        let zero = new Image()
        zero.src  = './assets/0.png'
        let one = new Image()
        one.src = './assets/1.png'
        let two = new Image()
        two.src = './assets/2.png'
        let three = new Image()
        three.src = './assets/3.png'
        let four = new Image()
        four.src = './assets/4.png'
        let five = new Image()
        five.src = './assets/5.png'
        let six = new Image()
        six.src = './assets/6.png'
        let seven = new Image()
        seven.src = './assets/7.png'
        let eight = new Image()
        eight.src = './assets/8.png'
        let nine = new Image()
        nine.src = './assets/9.png'

        let scores = [zero, one, two, three, four , five, six, seven, eight, nine]

        this.score = new Score({
            position: {
                x: this.canvas.width / 2,
                y: this.world.minY + 50 * this.scale
            },
            scale: this.scale,
            images: scores,
            betweenLength: 25 * this.scale
        } )


        this.finalScore = new Score({
            position: {
                x: this.canvas.width / 4 * 3 - 40 * this.scale,
                y: this.canvas.height / 3 + 22.5 * this.scale
            },
            scale: this.scale * 0.7,
            images: scores,
            betweenLength: 18.5 * this.scale})

        this.bestScore = new Score({
            position: {
                x: this.canvas.width / 4 * 3 - 40 * this.scale,
                y: this.canvas.height / 2 - 15 * this.scale
            },
            scale:  this.scale * 0.7,
            images: scores,
            betweenLength: 18.5 * this.scale})


    }

    /**
     * Initialize the menus of the game
     */
    initializeMenus()
    {
        let gameover = new Image()
        gameover.src = './assets/gameover.png'
        this.gameoverMessage = new Sprite({
            position: {
                x: this.canvas.width / 2 - 192 / 2 * this.scale,
                y: this.canvas.height / 2 - this.world.maxY * 0.8 / 2
            },
            image: gameover,
            scale: this.scale
        })

        let scoreMenuImg = new Image()
        scoreMenuImg.src = './assets/score-menu.png'

        this.scoreMenu = new Sprite({
            position: {
                x: this.canvas.width / 2 - this.world.maxX * 0.5 / 2,
                y: this.canvas.height / 2 - this.world.maxY * 0.75 / 2
            },
            image: scoreMenuImg,
            scale: 0.2 * this.scale
        })

        let startButtonImg = new Image()
        startButtonImg.src = './assets/start-button.png'

        this.startButton = new Sprite({
            position: {
                x: this.canvas.width / 2 - this.world.maxX * 0.5 / 2,
                y: this.canvas.height / 2 + this.world.maxY * 0.1 / 2
            },
            image: startButtonImg,
            scale: 0.1 * this.scale
        })

    }

    /**
     * Main draw function of the game, draws every component needed
     */
    draw()
    {
        this.canvas_ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.background.forEach(background => background.draw())
        this.pipes.forEach(pipe => pipe.draw())
        this.terrain.forEach(terrain => terrain.draw())

        if(!this.started)
            this.message.draw()

        this.bird.draw()

        if(game.started && !game.gameover)
            this.score.draw()

        if(game.gameover)
        {
            this.bird.draw()
            this.gameoverMessage.draw()
            this.scoreMenu.draw()
            this.startButton.draw()
            this.finalScore.draw()
            this.bestScore.draw()
        }
    }

    //https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
    run(timestamp)
    {
        if(timestamp < this.lastFrameTime + this.fps)
        {
            window.requestAnimationFrame(game.run.bind(game))
            return
        }

        this.delta =+ timestamp - this.lastFrameTime
        this.lastFrameTime = timestamp

        let numUpdateSteps = 0

        while (this.delta >= this.fps) {
            this.update(timestamp)
            this.delta -= this.fps
            if (++numUpdateSteps >= 240) {
                this.delta = 0
                break;
            }
        }

        this.draw()

        window.requestAnimationFrame(game.run.bind(game));
    }



    update(timestamp)
    {
        if (this.started && !this.gameover)
        {
            this.bird.update(this.frameCount, this.pipes)

            this.pipes.forEach(pipe => {
                pipe.update()
            })

            if(this.lastPipeUpdate + 2500 < timestamp)
            {
                this.lastPipeUpdate = timestamp
                this.spawnPipes()
                this.despawnPipes()
            }

            this.frameCount++
        }
        else if(this.gameover)
        {
            this.bird.update(this.frameCount, this.pipes)
            this.frameCount++
        }

        this.draw()
    }

    /**
     * Creates new pipes based on the world height
     */
    spawnPipes()
    {

        let height = Utils.randomIntBetween(this.world.minY + 200 * this.scale, this.world.maxY)

        let pipe = new Image()
        pipe.src = './assets/pipe-green.png'

        let flippedPipe = new Image()
        flippedPipe.src = './assets/pipe-green-flipped.png'

        let pipe1 = new Pipe({position: {
                x: this.world.maxX,
                y: height
            },
            image: pipe,
            scale: this.scale
        })

        let pipe2 = new Pipe({position: {
                x: this.world.maxX,
                y: height - this.world.maxY,
            },
            image: flippedPipe,
            reverted: true,
            scale: this.scale
        })

        this.pipes.push(pipe1)
        this.pipes.push(pipe2)
    }

    /**
     * Removes pipes from list based on x-coordinate of pipe.
     */
    despawnPipes()
    {
        this.pipes.forEach((pipe, index) => {
            if(pipe.position.x <= this.world.minX)
            {
                this.pipes.splice(index, 1)
            }
        })
    }

    /**
     * Click function, checks if certain boxes are hit
     * @param e: click event
     */
    click(e)
    {
        if(!this.sound.initialized)
            this.sound.initializeSounds()


        if(!this.started)
        {
            this.started = true
            return
        }

        if(this.startButton.isPointInHitBox(e.offsetX, e.offsetY) && this.gameover)
            this.reset()

        if(!this.bird.gravitySpeed - this.bird.speedY > this.bird.maximumSpeedY && !this.gameover)
        {
            this.sound.playSound('wing')
            this.bird.speedY += -5.0 * this.scale
        }
    }

    /**
     * the touch method supports mobile support for flappy bird
     * @param e, touch start event
     */
    touch(e)
    {
        e.preventDefault();

        if(!this.sound.initialized)
            this.sound.initializeSounds()


        if(!this.started)
        {
            this.started = true
            return
        }

        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        if(this.startButton.isPointInHitBox(x, y) && this.gameover)
            this.reset()

        if(!this.bird.gravitySpeed - this.bird.speedY > this.bird.maximumSpeedY && !this.gameover)
        {
            this.sound.playSound('wing')
            this.bird.speedY += -5.0 * this.scale
        }
    }

    /**
     * Triggers game over procedure
     */
    triggerGameOver()
    {
        this.gameover = true
        this.finalScore.score = this.score.score
        this.score.save()
        this.bestScore.load()
    }

    /**
     * Resets the whole game
     */
    reset()
    {
        this.gameover = false
        this.started = false
        this.pipes = []
        this.score.score = 0
        this.bird.reset()
    }

    /**
     * Call back for the bird
     * @param message, callback message
     */
    birdEvent(message)
    {
        if(message === "pipe_passed") {
            this.sound.playSound('point')
            this.score.incrementScore()
        }
        else if(message === "pipe_hit") {
            if(!this.gameover)
            {
                this.sound.playSound('hit')
                this.sound.playSound('die', 1)
            }
            this.triggerGameOver()
        }
        else if(message === "floor_hit") {
            if(!this.gameover)
                this.sound.playSound('hit')
            this.triggerGameOver()
        }
        else if(message === "ceil_hit") {
            if(!this.gameover)
            {
                this.sound.playSound('hit')
                this.sound.playSound('die', 1)
            }
            this.triggerGameOver()
        }
    }
}




game = new Game()
window.requestAnimationFrame(game.run.bind(game));
//game.intervalId = setInterval(game.update.bind(game), 1000 / game.fps)




