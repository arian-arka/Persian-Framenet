export default abstract class Listener{
    public abstract dispatch(...args : any[]) : any;
    public static async call(...args : any[]){
        return await (new (this as any)).dispatch(...args);
    }
}