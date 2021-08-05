//Convert time in seconds to string
function convertTimeToString(timeInSeconds) {
    //Get the hours
    const hours = Math.floor(timeInSeconds / 3600);

    //Get the minutes
    const minutes = Math.floor((timeInSeconds - 3600 * hours) / 60);

    //Get the seconds
    const seconds = (timeInSeconds - 3600 * hours - 60 * minutes);

    //Format by case
    return formatTimeString(hours, minutes, seconds);
}

function formatTimeString(hours, minutes, seconds) {
    if (hours > 0) {
        return formatNumber(hours) + ":" + formatNumber(minutes) + ":" + formatNumber(seconds);
    } else {
        return formatNumber(minutes) + ":" + formatNumber(seconds);
    }
}

function formatNumber(number) {
    return number >= 10 ? String(number) : "0" + String(number);
}