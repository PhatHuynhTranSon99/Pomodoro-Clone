//MVC model - idk if this is valid but im gonna do it anyway
var clockStates = settingModel.getSetting();

var view = {
    updateTime(text) {
        document.querySelector(".time")
                .textContent = text;
    },
    setMainButtonActive() {
        document.querySelector(".button")
                .classList
                .add("clicked");
    },
    setPodomoroButtonActive() {
        this.clearButtons();
        document.querySelector(".podomoro")
                .classList
                .add("inverted-clicked");
    },
    setShortBreakButtonActive() {
        this.clearButtons();
        document.querySelector(".short-break")
                .classList
                .add("inverted-clicked");
    },
    setLongBreakButtonActive() {
        this.clearButtons();
        document.querySelector(".long-break")
                .classList
                .add("inverted-clicked");
    },
    onMainClicked(handler) {
        document.querySelector(".button")
                .addEventListener("click", () => handler());
    },
    onPodomoroClicked(handler) {
        document.querySelector(".podomoro")
                .addEventListener("click", () => handler());
    },
    onShortBreakClicked(handler) {
        document.querySelector(".short-break")
                .addEventListener("click", () => handler());
    },
    onLongBreakClicked(handler) {
        document.querySelector(".long-break")
                .addEventListener("click", () => handler());
    },
    clearButtons() {
        document.querySelectorAll(".inverted-button")
                .forEach(function(item) {
                    item.classList.remove("inverted-clicked");
                });
    },
    changeBackgroundForShortBreak() {
        document.querySelector(".clock-section")
                .style.backgroundColor = "#2a9d8f";
        document.querySelector(".button")
                .style.color = "#2a9d8f";
    },
    changeBackgroundForLongBreak() {
        document.querySelector(".clock-section")
                .style.backgroundColor = "#264653";
        document.querySelector(".button")
                .style.color = "#264653";
    },
    changeBackgroundForPodomoro() {
        document.querySelector(".clock-section")
                .style.backgroundColor = "#f4a261";
        document.querySelector(".button")
                .style.color = "#f4a261";
    },
    changeMainButton(started) {
        if (started) {
            document.querySelector(".button")
                .classList
                .add("clicked");

            document.querySelector(".button")
                .textContent = "Stop";
        } else {
            document.querySelector(".button")
                .classList
                .remove("clicked");

            document.querySelector(".button")
                .textContent = "Start";
        }
    },
    getMessage(state) {
        switch(state) {
            case "podomoro":
                return "Time for studying";
            case "short-break":
                return "Time for short break";
            case "long-break":
                return "Time for a long break";
            default:
                return "Pomodoro clock";
        }
    },
    updateHeader(time, state) {
        document.title = time + " - " + this.getMessage(state);
    },
    clearHeader() {
        document.title = "Pomodoro clock";
    },
    requestNotification() {
        if (Notification.permission != "granted") {
            Notification.requestPermission();
        }
    },
    notify(state) {
        if (Notification.permission == "granted") {
            const noti = new Notification("Pomododo alert", {
                icon: "./favicon.ico",
                body: this.getMessage(state)
            });
        }
    }
};

var clockModel = {
    currentTime: clockStates[0].time,
    currentState: clockStates[0],
    currentIndex: 0,
    counter: 0,
    clockId: null,
    reset() {
        this.stop();
        this.currentTime = clockStates[0].time;
        this.currentState = clockStates[0];
        this.currentIndex = 0;
        this.counter = 0;
        this.clockId = null;
    },
    moveToNextState() {
        if (this.counter > 0 && this.counter % 4 == 0) {
            //2 hours have passed -> Take long break
            this.currentState = clockStates[2];
            this.currentIndex = 1;
            this.counter = 0;
        } else {
            if (this.currentIndex == 1) {
                this.counter++;
            }
            this.currentIndex = (this.currentIndex + 1) % 2;
            this.currentState = clockStates[this.currentIndex];
        }
        this.currentTime = this.currentState.time;
    },
    changeState(state) {
        this.stop();
        switch(state) {
            case "pomodoro":
                this.currentIndex = 0;
                this.currentState = clockStates[0];
                break;
            case "short-break":
                this.currentIndex = 1;
                this.currentState = clockStates[1];
                break;
            case "long-break":
                this.currentIndex = 2;
                this.currentState = clockStates[2];
                break;
        }
        this.counter = 0;
        this.currentTime = this.currentState.time;
    },
    start() {
        this.stop();
        this.onStart();
        this.clockId = setInterval(() => {
            //Update clock time
            this.currentTime--;

            //Call callback
            this.onTick(this.currentTime);

            //Call on stop if current time reaches 0
            if (this.currentTime == 0) {
                this.stop();
                this.onEnd();
            }
        }, 1000);
    },
    stop() {
        if (this.clockId) clearInterval(this.clockId);
    },
    setOnStart(handler) {
        this.onStart = handler;
    },
    setOnTick(handler) {
        this.onTick = handler;
    },
    setOnEnd(handler) {
        this.onEnd = handler;
    },
    getState() {
        return this.currentState.name;
    },
    getTime() {
        return this.currentTime;
    }
}

var controller = {
    view: view,
    model: clockModel,
    soundHelper,
    hasClockStarted: false,
    init() {
        //Set on model onStart, onStop and onTick
        this.model.setOnStart(() => this.onClockStart());
        this.model.setOnEnd(() => this.onClockEnd());
        this.model.setOnTick((time) => this.onClockTick(time));

        //Set view handler
        view.onMainClicked(() => this.startOrStopClock());

        //Set the initial time
        this.view.updateTime(convertTimeToString(this.model.getTime()));

        //Set on click
        this.view.onPodomoroClicked(() => this.changeClockState("pomodoro"));
        this.view.onShortBreakClicked(() => this.changeClockState("short-break"));
        this.view.onLongBreakClicked(() => this.changeClockState("long-break"));

        //Set on setting changed
        settingModel.onSettingsChanged(() => this.onSettingsChanged());
    },
    startOrStopClock() {
        if (!this.hasClockStarted) {
            this.startClock();
            this.hasClockStarted = true;
        } else {
            this.stopClock();
            this.hasClockStarted = false;
        }
    },
    changeClockState(state) {
        this.model.changeState(state);
        this.updateUI();
    },
    startClock() {
        this.view.changeMainButton(true);
        this.model.start();
    },
    stopClock() {
        this.view.changeMainButton(false);
        this.view.clearHeader();
        this.model.stop();
    },
    onClockStart() {
        this.soundHelper.playStart();
        this.view.changeMainButton(true);
    },
    onClockEnd() {
        this.model.moveToNextState();
        this.view.clearHeader();
        this.view.notify(this.model.getState());
        this.soundHelper.playEnd();
        this.updateUI();
    },
    onSettingsChanged() {
        clockStates = settingModel.getSetting();
        this.model.reset();
        this.view.clearHeader();
        this.updateUI();
    },
    updateUI() {
        //Check the state of the clock
        this.view.updateTime(convertTimeToString(this.model.getTime()));
        this.view.changeMainButton(false);
        switch (this.model.getState()) {
            case "podomoro":
                this.view.setPodomoroButtonActive();
                this.view.changeBackgroundForPodomoro();
                break;
            case "short-break":
                this.view.setShortBreakButtonActive();
                this.view.changeBackgroundForShortBreak();
                break;
            case "long-break":
                this.view.setLongBreakButtonActive();
                this.view.changeBackgroundForLongBreak();
                break;
        }
    },
    onClockTick(time) {
        this.view.updateHeader(
            convertTimeToString(time), 
            this.model.getState()
        );
        this.view.updateTime(convertTimeToString(time));
    }   
};

controller.init();
