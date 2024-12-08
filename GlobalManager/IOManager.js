/**
 * Class representing a virtual keyboard.
 */
class VKeyboard {
    constructor() {
        /**
         * A map to keep track of the state of keys.
         * @type {Object.<string, boolean>}
         */
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

    require_select_obj(objs) {

    }
}