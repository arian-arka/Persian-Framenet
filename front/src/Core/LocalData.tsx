import {createContext, createEffect, createSignal, useContext} from "solid-js";
import {useNavigate} from "@solidjs/router";
import Config from "../Config";
import Log from "./Log";
import localStorageEvent from "../localStorageEvent";

const LocalDataContext = createContext();

const tryParseJson = (data: any) => {
    try {
        if (data === undefined || data === null || data === '')
            return null;
        else if (typeof data === 'string' || typeof data === "number" || typeof data === 'boolean')
            return data;
        else
            return JSON.parse(data);
    } catch (e) {
        Log.debug('e', e);
        Log.debug('json parse errror', data);
        return data;
    }
}
const tryStringifyJson = (data: any) => {
    if (data === undefined || data === null || data === '')
        return '';
    else if (typeof data === 'string' || typeof data === "number" || typeof data === 'boolean')
        return data + '';
    return data;
}
const localStorageToData = (holdKeys:string[]=[]) => {
    const data: any = {};
    for (let key of Object.keys(localStorage)){
        if (holdKeys.length === 0 || holdKeys.includes(key))
            data[key] = tryParseJson(localStorage.getItem(key))
        else
            localStorage.removeItem(key);
    }
    return data;
}
export interface LocalDataInterface {
    localData(): any,

    set(key: string, value: any): void,

    get(key: string): any,

    remove(key: string): void,
    removeKeys(keys:string[]):void,

    removeAll(): void,
    navigate(...args:any[]):void,
}
export function LocalDataProvider(props: any) {
    const navigate = useNavigate();
    const [data, setData] = createSignal(localStorageToData(props?.keys ?? []), {equals: false});

    const setItemToData = (key: string, val: any) => {
        const _: any = data();
        _[key] = val;
        setData(_);
    }
    const removeItemFromData = (key: string) => {
        const _: any = data();
        delete _[key];
        setData(_);
    }
    const set = (key: string, value: any) => {
        localStorage.setItem(key, tryStringifyJson(value))
        setItemToData(key, value);
    };
    const get = (key: string) => {
        const _ = data();
        if (key in _)
            return _[key];
        return null;
    }
    const remove = (key: string) => {
        localStorage.removeItem(key);
        removeItemFromData(key);
    };

    const removeKeys = (keys: string[]) => keys.map((key:string) => remove(key))
    const removeAll = () => {
        localStorage.clear();
        setData({});
    };

    window.onstorage = () => {
        console.log('storage keys',props.keys);
        setData(localStorageToData(props?.keys ?? []));
        console.log('storage data',data());

    };


    const val: LocalDataInterface = {localData: data, set,removeKeys, get, remove, removeAll,navigate};

    createEffect(() => {
        const _ = data();
        for(let callback of localStorageEvent)
            callback(val,navigate);
    })

    return (
        <LocalDataContext.Provider value={val}>
            {props.children}
        </LocalDataContext.Provider>
    );
}
export function useLocalData(): LocalDataInterface {
    return useContext(LocalDataContext) as LocalDataInterface;
}