import Response from "../../Class/Response";

export type PermanentRedirectDataType = string;

export default class PermanentRedirect extends Response<PermanentRedirectDataType> {
    status(): number {
        return 301;
    }

    headers(): { [p: string]: any } {
        return {...super.headers(), ...{'Location': this._data}};
    }

    setUrl(url: string): PermanentRedirect {
        this._data = url;
        return this;
    }

    static redirect(url: PermanentRedirectDataType): PermanentRedirect {
        return this.instance(url);
    }

    static instance(url: PermanentRedirectDataType): PermanentRedirect {
        return (new this()).setUrl(url);

    }
}

