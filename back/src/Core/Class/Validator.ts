import Ajv, {DefinedError, JSONSchemaType} from "ajv"
import addFormats from "ajv-formats";
import BadRequest from "../Response/400/BadRequest";

export type CustomErrorType = {
    [key: string]: string
}

export default class Validator<schema> {
    private _ajv: Ajv;
    private _hasError: boolean = false;
    private _errors: CustomErrorType = {};
    private _data: any;
    private _throwBadRequest: boolean;
    // @ts-ignore
    private _options: any;

    constructor(options: object = {
        removeAdditional: true,
        allErrors: true,
    }, throwBadRequest: boolean = true) {
        this._options = options;
        this._throwBadRequest = throwBadRequest;
        this._ajv = new Ajv(options);
        addFormats(this._ajv)
        require("ajv-errors")(this._ajv)
    }

    enableThrowing(status: boolean = true): Validator<schema> {
        this._throwBadRequest = status;
        return this;
    }

    hasError(): boolean {
        return this._hasError;
    }

    errors(): CustomErrorType {
        return this._errors;
    }

    error(key: string): string {
        return this._errors[key];
    }

    data(): schema {
        return this._data;
    }

    assignRouteValue(errors: DefinedError[]): Validator<schema> {
        console.log(errors);
        for (let error of errors) {
            if (typeof error.params === 'object' && ('missingProperty' in error.params))
                this._errors[`${error.instancePath}/${error.params.missingProperty}`.replace(/^\/|\/$/g, '')
                    .replaceAll('/', '.')] = error.message ?? 'error';
            else{
                const indexOf = error.message?.indexOf('|') ?? -1;
                if(indexOf === -1)
                    this._errors[error.instancePath.replace(/^\/|\/$/g, '')
                        .replaceAll('/', '.')] = error.message ?? 'error';
                else
                    this._errors[error.message?.substring(0,indexOf) ?? ''] = (error.message?.substring(indexOf+1) ?? '') ?? 'error';
            }
        }
        return this;
    }

    validate(data: any, rules: JSONSchemaType<schema>): Validator<schema> {
        const validate = this._ajv.compile(rules);
        this._hasError = !validate(data);
        if (this._hasError) {
            this._data = undefined;
            this.assignRouteValue(validate.errors as DefinedError[]);
            if(this._throwBadRequest)
                throw this.badRequest();
        } else {
            this._data = data;
        }

        return this;
    }

    badRequest(): BadRequest {
        return BadRequest.forErrors(this._errors, 'Validation failed.');
    }

    async custom(callback: Function): Promise<Validator<schema>> {
        return await callback(this.data()).then((errors: CustomErrorType | undefined | null) => {
            if (errors) {
                this._errors = {...this._errors, ...errors};
                if(this._throwBadRequest)
                    throw this.badRequest();
            }
            return this;
        });
    }
}