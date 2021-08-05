var settingModel = {
    podomoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    setPodo(timeInMinutes) {
        this.podomoro = timeInMinutes * 60;
    },
    setShortBreak(timeInMinutes) {
        this.shortBreak = timeInMinutes * 60;
    },
    setLongBreak(timeInMinutes) {
        this.longBreak = timeInMinutes * 60;
    },
    saveSetting() {
        const settingObjects = [
            {
                name: "podomoro",
                time: this.podomoro //Podomoro time
            },
            {
                name: "short-break",
                time: this.shortBreak //Short break time
            },
            {
                name: "long-break",
                time: this.longBreak //Long break time
            }
        ]

        localStorage.setItem("SETTINGS", JSON.stringify(settingObjects));

        //Called on setting changed
        this.onChanged();
    },
    loadSetting() {
        //Get the setting object as string
        const settings = localStorage.getItem("SETTINGS");

        //Check if setting exists
        if (settings) {
            const settingObjects = JSON.parse(settings);
            this.podomoro = settingObjects[0].time;
            this.shortBreak = settingObjects[1].time;
            this.longBreak = settingObjects[2].time;
        }
    },
    getSetting() {
        return [
            {
                name: "podomoro",
                time: this.podomoro //Podomoro time
            },
            {
                name: "short-break",
                time: this.shortBreak //Short break time
            },
            {
                name: "long-break",
                time: this.longBreak //Long break time
            }
        ]
    },
    onSettingsChanged(handler) {
        this.onChanged = handler;
    }
};

var settingView = {
    onSettingsClicked(handler) {
        document.querySelector(".settings")
                .addEventListener("click", () => handler());
    },
    onCloseClicked(handler) {
        document.querySelector(".modal-close")
                .addEventListener("click", () => handler());
    },
    onOutsideClicked(handler) {
        document.querySelector(".modal-content")
                .addEventListener("click", (e) => { 
                    if (e.target === "modal") handler();
                });
    },
    onOkClicked(handler) {
        document.querySelector(".modal-form button")
                .addEventListener("click", (e) => { 
                    e.preventDefault();
                    handler(); 
                });
    },
    onPodoChanged(handler) {
        document.querySelector("#podo").onchange = (e) => handler(e.target.value);
    },
    onShortBreakChanged(handler) {
        document.querySelector("#short-b").onchange = (e) => handler(e.target.value);
    },
    onLongBreakChanged(handler) {
        document.querySelector("#long-b").onchange = (e) => handler(e.target.value);
    },
    showModal() {
        document.querySelector(".modal").style.display = "flex";
    },  
    hideModal() {
        document.querySelector(".modal").style.display = "none";
    }
};

var settingController = {
    view: settingView,
    model: settingModel,
    init() {
        //Inputs
        this.view.onSettingsClicked(() => this.showModal());
        this.view.onCloseClicked(() => this.hideModal());
        this.view.onOutsideClicked(() => this.hideModal());
        this.view.onOkClicked(() => this.saveSettings());

        this.view.onPodoChanged((value) => this.handlePodoChanged(value));
        this.view.onShortBreakChanged((value) => this.handleShortBreakChanged(value));
        this.view.onLongBreakChanged((value) => this.handleLongBreakChanged(value));

        //Load settings
        this.model.loadSetting();
    },
    showModal() {
        this.view.showModal();
    },
    hideModal() {
        this.view.hideModal();
    },
    saveSettings() {
        this.model.saveSetting();
        this.hideModal();
    },
    handlePodoChanged(value) {
        this.model.setPodo(value);
    },
    handleShortBreakChanged(value) {
        this.model.setShortBreak(value);
    },
    handleLongBreakChanged(value) {
        this.model.setLongBreak(value);
    }
}

settingController.init();