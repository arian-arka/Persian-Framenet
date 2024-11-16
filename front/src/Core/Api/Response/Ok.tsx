import Response from "./Response";

export class Ok<schema> extends Response<schema>{
    constructor(headers: Headers, status: number, data: schema,isRealRequest : boolean = true) {
        super(headers,status,true,data,isRealRequest);
    }
}