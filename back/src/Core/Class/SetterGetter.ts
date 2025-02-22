class SetterGetter {
    [key : string] : any;

    _set(name: string, value: any): this {
        this[name] = value;
        return this;
    }

    _get(name: string): any {
        return name in this ? this[name] : undefined;
    }

    _sets(objects: { [key : string] : any; }) {
        for(let key in objects)
            this[key] = objects[key];
        return this;
    }

    keys(){
        return Object.keys(this);
    }

}

export default SetterGetter;