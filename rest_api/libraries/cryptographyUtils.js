function scramble (string) {

    var x = string.split('').sort(function () { return 0.5 - Math.random() }).join('');
    function substitute(str) {
        var pos = Math.floor(Math.random() * str.length);
        return str.substring(0, pos) + getRandomLetter() + str.substring(pos + 1);
    }
    function getRandomLetter() {
        var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var pos = Math.floor(Math.random() * letters.length);
        return letters.charAt(pos);
    }
    for (var i = 0; i < randomIntFromInterval(1, 10); i++) {
        x = string.split('').sort(function () { return 0.5 - Math.random() }).join('');
        x = substitute(x)
    }
    return x
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

exports.scramble = scramble;
exports.randomIntFromInterval = randomIntFromInterval;