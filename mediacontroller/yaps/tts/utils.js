/**
 * @author Pedro Sanders
 * @since v1
 */
const flat = require('flat')
const crypto = require('crypto')
const sox = require('sox-audio')()
const sleep = require('syncho').sleep

const computeFilename = (text, options = {}) => {
    let c = text
    if (options.cachingFields) {
        const flatObj = flat(options)
        c = options.cachingFields.map(opt => flatObj[opt]).sort().join()
    }
    return crypto.createHash('md5')
        .update(`${text},${c}`).digest('hex')
}

// Keeping this simple for now
// Expects the input file to be a .wav
const transcodeSync = file => {
    const fileOut = file + '_transcoded'
    sox.on('error',
      (err, stdout, stderr) => console.error(`Cannot process audio: ${err.message}`) )
    sox.input(file)
    sox.output(fileOut)
       .outputSampleRate(8000)
       .outputFileType('wav')
    sox.run()

    let end
    sox.on('end', () => end = true);
    while(!end) sleep(100)

    return fileOut
}

module.exports.computeFilename = computeFilename
module.exports.transcodeSync = transcodeSync