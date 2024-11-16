import Config from "../Config";

class Language {
    private current: string;

    constructor() {
        this.current = Config.defaultLanguage;

    }

    setLanguage(lang: string) {
        this.current = lang;
        return this;
    }

    get(keys: string, ...args: any[]) {
        let val = Config.languages[this.current];

        for (let key of keys.split('.'))
            val = val[key];

        if (typeof val === 'function')
            return val(...args);

        return val;
    }
}

export default new Language;