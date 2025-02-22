import Loader from "../Singleton/Loader";
import Path from "../Singleton/Path";
import Framework from "../Framework";

export default class Language {
    public _lang : string ;

    private _available : string[] = [];

    private _templates : {[key : string] :any} = {};

    constructor() {
        this._lang = Framework.Config.Language?.def ?? 'en';
        this._available = Framework.Config.Language?.available ?? [];
        for(let lang of this._available)
            this._templates[lang] = Loader.default(Path.langPath(lang));
    }
    lang(language : string) : Language{
        this._lang = language;
        return this;
    }

    current() : string{
        return this._lang;
    }

    generate(keys : string,...args : any[]) : string{
        let val = this._templates[this.current()];

        for(let key of keys.split('.'))
            val = val[key];

        return typeof val === 'function' ? val(...args) : val;
    }

    pair(key : string,keys : string,...args : any[]) : {[key : string] : string}{
        return {
            [key] : this.generate(keys,...args)
        };
    }

}