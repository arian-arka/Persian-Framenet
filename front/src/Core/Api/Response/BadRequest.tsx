import Response from "./Response";
type BadRequestType = {
    message?: string,
    errors?: { [key: string]: string },

    data?: { [key: string]: any },
};
export class BadRequest extends Response<BadRequestType>{
    constructor(headers: Headers, status: number, data: BadRequestType,isRealRequest : boolean = true) {
        super(headers,status,false,data,isRealRequest);
    }
}