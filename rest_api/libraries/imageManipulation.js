const axios = require('axios');

async function urlToBuffer(URL) {
    const response = await axios.get(URL, { responseType: 'arraybuffer' })
    return Buffer.from(response.data, "utf-8")
}

exports.urlToBuffer = urlToBuffer