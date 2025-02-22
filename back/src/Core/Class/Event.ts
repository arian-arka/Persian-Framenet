import Listener from "./Listener";

export default abstract class Event<DataSchema=any>{

    protected abstract listeners : (typeof Listener)[];

    public static async fire<DataSchema=any>(data : DataSchema=undefined as DataSchema){
        for(let listener of (new (this as any)).listeners)
            await listener.call(data);
    }

}