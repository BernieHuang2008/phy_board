class ObjectManager {
    constructor(env) {
        this.env = env;

        this.object_id = new Map();
        this.id_object = new Map();
        this.type_object = new Map();
        this.selected = [];
    }

    _id_counter = 0;    // 0 will be assigned to the World object

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

        var objclass = (Reflect.getPrototypeOf(obj)).constructor.name;
        if (objclass in this.type_object)
            this.type_object.get(objclass).add(obj);
        else
            this.type_object.set(objclass, new Set([obj]));

        obj.id = id;
    }

    /**
     * Remove an object by its id.
     */
    remove(obj) {
        this.object_id.remove(obj);
        this.id_object.remove(id);
        this.type_object.get(obj.constructor.name).delete(obj);
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
    select_add(obj) {
        this.selected.push(obj);
        obj.draw_outline(this.env);
        showDetail(obj);
    }

    get_all_obj_of_types(types) {
        var objs = new Set();
        for (var i=0; i<types.length; i++) {
            var subt = types[i];
            var all_objs_of_type = this.type_object.get(subt) || new Set();
            objs = objs.union(all_objs_of_type);
        }
        return objs;
    }
}