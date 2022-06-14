/**
 * The sound class contains everything sound related
 */
class Sound {
    constructor() {
        this.initialized = false
    }

    /**
     * Initialize all the sounds.
     */
    initializeSounds()
    {
        window.AudioContext = window.AudioContext || window.webkitAudioContext

        this.context = new AudioContext()
        this.soundMap = new Map()

        this.loadBuffer('./audio/die.wav', this, function (buffer, soundMap) {
            soundMap.set('die', buffer)
        })

        this.loadBuffer('./audio/hit.wav', this, function (buffer, soundMap) {
            soundMap.set('hit', buffer)
        })

        this.loadBuffer('./audio/point.wav', this, function (buffer, soundMap) {
            soundMap.set('point', buffer)
        })

        this.loadBuffer('./audio/swoosh.wav', this, function (buffer, soundMap) {
            soundMap.set('swoosh', buffer)
        })

        this.loadBuffer('./audio/wing.wav', this, function (buffer, soundMap) {
            soundMap.set('wing', buffer)
        })
        this.initialized = true
    }

    /**
     * Buffer loader for the sounds
     * @param url, url of the audio, usually a wav file
     * @param sound, sound class
     * @param onLoad, onload function so that the buffer sound can be saved.
     */
    loadBuffer(url, sound, onLoad)
    {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function ()
        {
            const audioData = request.response

            sound.context.decodeAudioData(audioData).then(function (buffer) {
                onLoad(buffer, sound.soundMap)
            }, function (error) {
                console.log(error)
            })
        }

        return request.send()
    }

    /**
     * Plays a sound
     * @param name, name of the sound
     * @param time, delay when sound needs to be played.
     */
    playSound(name, time = 0)
    {
        let source = this.context.createBufferSource()
        source.buffer = this.soundMap.get(name)
        source.connect(this.context.destination)
        source.start(time)
    }
}
