/**
 * Contains several tools used in the game
 */
class Utils {
    /**
     * Looks if 2 rectangles intersect with each other
     * @param r1
     * @param r2
     * @returns {boolean}
     */
    static intersectRectangle(r1, r2) {
        return !(r1.x > r2.x + r2.w || r1.x + r1.w < r2.x || r1.y > r2.y + r2.h || r1.y + r1.h < r2.y);
    }

    /**
     * Saves the score in the cookies.
     * @param score
     */
    static saveScore(score)
    {
        document.cookie = `score=${score}; remember_me=true`;
    }

    /**
     * Loads the score from the cookies
     * @returns {string}
     */
    static loadScore()
    {
        return ('; '+document.cookie).split(`; score=`).pop().split(';')[0];
    }

    /**
     * Random interger between min and max
     * @param min
     * @param max
     * @returns {number} the random integer
     */
    static  randomIntBetween(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

}
