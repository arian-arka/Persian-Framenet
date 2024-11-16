class Response<T> {

    constructor(headers: Headers, status: number, ok: boolean, data: T,isRealRequest : boolean = true) {
        this.status = status;
        this.headers = headers;
        this.ok = ok;
        this.data = data;
        this.isRealRequest = isRealRequest;
    }

    status: number;
    headers: Headers;
    isRealRequest : boolean = true;
    ok: boolean;
    data: T;
}
export default Response;