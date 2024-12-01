class ObjectManager {
    constructor (env) {
        this.env = env;

        this.object_id = new Map();
        this.id_object = new Map();
    }

    _id_counter = 0

    /**
     * Use an id-counter to generate a new id.
     */
    newid(){
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
}