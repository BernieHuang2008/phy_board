class ObjectManager {
    constructor(env) {
        this.env = env;

        this.object_id = new Map();
        this.id_object = new Map();
        this.selected = [];
    }

    _id_counter = 1;

    /**
     * Use an id-counter to generate a new id.
     */
    newid() {
        var id = this._id_counter;
        this._id_counter += 1;
        return id;
    }

    /**
     * Register an object with a new id.
     */
    add(obj) {
        var id = this.newid();
        this.object_id.set(obj, id);
        this.id_object.set(id, obj);

        obj.id = id;
    }

    /**
     * Remove an object by its id.
     */
    remove(obj) {
        this.object_id.remove(obj);
        this.id_object.remove(id);
    }

    /**
     * Iter through all objects, and execute function for each.
     */
    all_do(callable) {
        for (var x of this.id_object) {
            var [id, obj] = x;
            callable(id, obj);
        }
    }

    /**
     * Select an object.
     */
    select(obj) {
        this.env.canvasMgr.redraw();
        this.selected = [];

        if (obj == null) {
            showDetail(window.MainEnv.world);   // TODO: change default to 'World' Fake Object
            return;
        }
        this.select_add(obj);
    }

    /**
     * Add an object to the selected list.
     */
    select_add(obj) {
        this.selected.push(obj);
        obj.draw_outline(this.env);
        showDetail(obj);
    }
}