/**
 * The score class keeps up with the score in the game and draws it on the screen. The score inherits the sprite class.
 */
class Score extends Sprite {
    constructor({position, scale, images, betweenLength = 25}) {
        super({position: position, scale: scale});
        this.score = 0
        this.bestScore = 0
        this.images = images
        this.betweenLength = betweenLength
    }

    /**
     * Draws the score on the screen, based on the score field of the class. If multiple images are needed from the assets, the images will be centered.
     */
    draw() {
        let scores = String(this.score).split('')
        scores.reverse()

        for(let [index, score] of scores.entries())
        {
            score = parseInt(score)
            if(score === 1)
                game.canvas_ctx.drawImage(this.images[score], this.position.x + 6 - this.betweenLength * index, this.position.y, this.images[score].width * this.scale, this.images[score].height * this.scale)
            else
                game.canvas_ctx.drawImage(this.images[score], this.position.x - this.betweenLength * index, this.position.y, this.images[score].width * this.scale, this.images[score].height * this.scale)
        }
    }

    /**
     * Increments the score after passing a pipe.
     */
    incrementScore()
    {
        this.score++
    }

    save()
    {
        if(this.score > this.bestScore){
            Utils.saveScore(this.score)
            return this.score
        }
        return this.bestScore
    }

    load()
    {
        this.score =  Utils.loadScore()
    }
}
