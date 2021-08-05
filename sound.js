var soundHelper = {
    playStart() {
        const audio = new Audio("./sounds/start.wav");
        audio.play();
    },
    playEnd() {
        const audio = new Audio("./sounds/end.wav");
        audio.play();
    }
}