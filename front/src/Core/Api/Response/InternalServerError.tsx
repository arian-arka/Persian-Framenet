import Response from "./Response";

export class InternalServerError extends Response<any>{
    constructor(headers: Headers, status: number, data: any,isRealRequest : boolean = true) {
        super(headers,status,false,data,isRealRequest);
    }
}