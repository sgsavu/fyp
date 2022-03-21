const axios = require('axios');

/**
 * Converts and url to a buffer of uints
 * @param URL the url we wish to convert
 * @returns {Buffer} the buffer of uints
 */
async function urlToBuffer(URL) {
    const response = await axios.get(URL, { responseType: 'arraybuffer' })
    return Buffer.from(response.data, "utf-8")
}

exports.urlToBuffer = urlToBuffer