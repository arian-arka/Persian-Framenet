import Validator from "./Validator";
import {JSONSchemaType} from "ajv";
import {FastifyRequest} from "fastify";
import Framework from "../Framework";


export default class Validation<schema,dataSchema = any>{
    // @ts-ignore
    protected additionalData : dataSchema;
    constructor(additionalData : dataSchema = {} as dataSchema) {
        this.additionalData = additionalData;
    }

    pair(key : string,keys : string,...args : any[]) {
        return Framework.Language.pair(key,keys,args);
    }

    generate(keys : string,...args : any[]) {
        return Framework.Language.generate(keys,args);
    }

    custom() : Function{
        return async (data : schema) => {

        }
    }

    rules() : JSONSchemaType<schema|{}>{
        return {
            type :'object',
            properties:{}
        };
    }

    async make(data : any) : Promise<Validator<schema>> {
        const validator =  (new Validator<schema>()).validate(data,this.rules());
        return await validator.custom(this.custom())
    }

    static forRequest<s,dataSchema = any>(request : FastifyRequest,additionalData : dataSchema=null as dataSchema) : Promise<Validator<s>> {
        return (new this<s,dataSchema>(additionalData)).make(request.body as any);
    }

    static forBody<s,dataSchema = any>(request : FastifyRequest,additionalData : dataSchema=null as dataSchema) : Promise<Validator<s>> {
        return (new this<s,dataSchema>(additionalData)).make(request.body as any);
    }

    static forQuery<s,dataSchema = any>(request : FastifyRequest,additionalData : dataSchema=null as dataSchema) : Promise<Validator<s>> {
        return (new this<s,dataSchema>(additionalData)).make(request.query as s);
    }

    static forData<s,dataSchema = any>(data : any,additionalData : dataSchema=null as dataSchema) : Promise<Validator<s>> {
        return (new this<s,dataSchema>(additionalData)).make(data);
    }
}