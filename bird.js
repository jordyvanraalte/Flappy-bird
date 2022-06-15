/**
 * The bird class represents the player class that can be controlled. It contains all the movement of the bird updates or actions of the bird
 */

class Bird extends Sprite {
    constructor({position, scale, images, callback}) {
        super({ position: position, scale: scale});

        // birds movement
        this.speedY = 0
        this.maximumSpeedY = -3 * this.scale
        this.gravity = 0.2 * this.scale
        this.gravitySpeed = 0

        // angle bird is turning
        this.angle = 0

        // animation
        this.images = images
        this.framesAmount = images.length
        this.currentFrame = 0
        this.callback = callback
        this.floorHit = false
    }

    draw()
    {
        game.canvas_ctx.save();
        game.canvas_ctx.translate(this.position.x + this.images[this.currentFrame].width / 2, this.position.y + this.images[this.currentFrame].height / 2)
        game.canvas_ctx.rotate(this.angle);
        game.canvas_ctx.translate(-(this.position.x + this.images[this.currentFrame].width / 2), -(this.position.y + this.images[this.currentFrame].height / 2))
        game.canvas_ctx.drawImage(this.images[this.currentFrame], this.position.x, this.position.y, this.images[this.currentFrame].width * this.scale, this.images[this.currentFrame].height * this.scale)
        game.canvas_ctx.restore();
    }

    update(frameCount, pipes) {
        this.updateAngle()

        this.calculatePosition()

        this.updateFrames(frameCount)

        this.isColliding(pipes)

        this.passed(pipes)
    }

    /**
     * updates the animation frames of the bird
     * @param frameCount current amount of frames
     */
    updateFrames(frameCount)
    {
        if(this.currentFrame === (this.framesAmount - 1))
            this.currentFrame = 0
        else if(frameCount % 30 === 0)
            this.currentFrame++
    }

    /**
     * updates the bird angle.
     */
    updateAngle()
    {
        if(this.speedY + this.gravitySpeed < 0 && this.angle > -(Math.PI / 6) && !this.floorHit)
            this.angle -= 0.2

        else if(this.speedY + this.gravitySpeed > 0 && this.angle < Math.PI / 2 && !this.floorHit)
            this.angle += 0.02
    }

    /**
     * calculates the new position of the bird. It also contains when the bird hits the floor or ceiling.
     */
    calculatePosition()
    {
        // if bird hits world borders.
        if(this.position.y > game.world.maxY)
        {

        }
        else if(this.position.y < game.world.minY)
        {
            this.speedY = -(this.gravitySpeed)
            this.gravitySpeed += this.gravity
            this.position.y += this.speedY + this.gravitySpeed

        }
        else {
            this.gravitySpeed += this.gravity
            if(this.speedY > 0)
                this.speedY += this.gravitySpeed

            this.position.y += this.speedY + this.gravitySpeed
        }
    }

    /**
     * looks if the bird is colliding with the pipe or
     * @param pipes is all the currently spawned pipes
     * @returns {boolean} returns if the bird collided with the floor, ceiling or pipes.
     */
    isColliding(pipes)
    {
        if(this.position.y > game.world.maxY )
        {
            this.floorHit = true
            if(!game.gameover)
                this.callback("floor_hit")
            return true
        }

        if(this.position.y <= game.world.minY)
        {
            if(!game.gameover)
                this.callback("ceil_hit")
            return true
        }

        for(const pipe of pipes){
            let hitBoxBird = this.getHitBox()
            let hitBoxPipe = pipe.getHitBox()
            if(Utils.intersectRectangle(hitBoxBird, hitBoxPipe))
            {
                this.callback("pipe_hit")
                return true
            }
        }
        return false
    }

    /**
     * keeps the score updated
     * @param pipes, current pipes in game.
     */
    passed(pipes) {
        for(const pipe of pipes) {
            let x = pipe.position.x + pipe.image.width
            if(x < this.position.x && !pipe.passed && !pipe.reverted) {
                pipe.passed = true
                this.callback('pipe_passed')
            }
        }
    }


    /**
     * Gets the hitbox of the entity.
     * @returns {{w: number, x: number, h: number, y: number}} hitbox values
     */
    getHitBox()
    {
        let x = this.position.x
        let y = this.position.y
        let w = this.images[0].width * this.scale
        let h = this.images[0].height * this.scale
        return {x, y, w, h}
    }


    /**
     * Resets the bird to the original position.
     */
    reset()
    {
        this.position = {x: game.canvas.width / 2 - 100 * this.scale,
            y: game.canvas.height / 2 + 35 * this.scale
        }
        this.gravity = 0.2 * this.scale
        this.gravitySpeed = 0
        this.speedY = 0
        this.angle = 0
        this.floorHit = false
    }
}

