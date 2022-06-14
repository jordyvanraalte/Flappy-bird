/**
 * Sprite class resembles one entity of the flappy bird world.
 */
class Sprite {
    constructor({
        position = { x: 0, y: 0},
        scale = 1,
        image,
    })
    
    {
        this.position = position
        this.scale = scale
        this.image = image
    }

    draw()
    {
        game.canvas_ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale)
    }

    getHitBox()
    {
        let x = this.position.x
        let y = this.position.y
        let w = this.image.width * this.scale
        let h = this.image.height * this.scale
        return {x, y, w, h}
    }

    isPointInHitBox(x,y)
    {
        let hitBox = this.getHitBox()
        return hitBox.x <= x && x <= hitBox.x + hitBox.w &&
            hitBox.y <= y && y <= hitBox.y + hitBox.h;
    }
}

