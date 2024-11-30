class VKeyboard {
    constructor() {
        this.keyMap = {};

        // listener
        document.addEventListener("keydown", (e) => {
            this.keyMap[e.key] = true;
        });

        document.addEventListener("keyup", (e) => {
            this.keyMap[e.key] = false;
        });

        document.addEventListener("focusout", (e) => {
            this.keyMap = {};
        });

        return this;
    }
}

class IOManager {
    constructor(env) {
        this.env = env;
        this.vkb = new VKeyboard();
    }
}