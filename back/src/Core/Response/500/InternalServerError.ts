import Response from "../../Class/Response";

export default class InternalServerError extends Response<any> {
    constructor(data : any = undefined) {
        super();
        this._data = data;
    }

    status(): number {
        return 500;
    }

    static instance(data : any = undefined) :  InternalServerError {
        return (new this(data));
    }
}