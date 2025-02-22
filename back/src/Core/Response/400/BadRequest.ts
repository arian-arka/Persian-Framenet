import Response from "../../Class/Response";

export type BadRequestDataType = {
    message?: string|undefined|null,
    errors?: { [key: string]: string },

    data?: any,
}
export default class BadRequest extends Response<BadRequestDataType> {

    protected _errors: { [key: string]: string } = {};

    protected _message: string|null = null;

    constructor(message: string|null = null) {
        super();
        this._message = message;
    }

    data(): BadRequestDataType {
        return {
            message: this._message,
            errors: this._errors,
            data : this._data,
        }
    }

    setError(key: string, value: string): BadRequest {
        this._errors[key] = value;
        return this;
    }

    getError(key: string): string {
        return key in this._errors ? this._errors[key] : '';
    }

    setErrors(errors: { [key: string]: string }): BadRequest {
        this._errors = {...this._errors, ...errors};
        return this;
    }

    setMessage(value: string): BadRequest {
        this._message = value;
        return this;
    }

    getMessage(): string {
        return this._message ?? '';
    }

    status(): number {
        return 400;
    }

    static instance(message: string |null = null): BadRequest | any {
        return new this(message);
    }

    static forMessage(message: string|null = null): BadRequest | any {
        return new this(message);
    }

    static forErrors(errors: { [key: string]: string },message: string = '' ): BadRequest | any {
        return (new this(message)).setErrors(errors);
    }


}