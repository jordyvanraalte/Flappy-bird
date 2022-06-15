/**
 * The pipe class represents the pipes in the game. Pipes can be upside down (reverted) and will be drawn based on that. In the game, the pipes towards the bird instead
 * of moving the bird with the world to the pipes. The pipe class inherits the sprite class.
 */
class Pipe extends Sprite
{
    constructor({position, scale, image, reverted = false}) {
        super({position: position, scale: scale, image});
        this.speedX = -3 * scale
        this.passed = false
        this.reverted = reverted
    }

    update() {
        this.calculatePosition()
    }

    /**
     * Calculates the new position of the pipe after moving it.
     */
    calculatePosition()
    {
        this.position.x += this.speedX
    }
}
