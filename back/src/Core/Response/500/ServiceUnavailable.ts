import Response from "../../Class/Response";

export default class ServiceUnavailable extends Response<any> {
    constructor(data : any = undefined) {
        super();
        this._data = data;
    }

    status(): number {
        return 503;
    }

    static instance(data : any = undefined) :  ServiceUnavailable {
        return (new this(data));
    }
}