import {createContext, useContext} from "solid-js";
import {useNavigate} from "@solidjs/router";
import Config from "../Config";

const NavigationContext = createContext();

export interface NavigationInterface {
    message(message: string, url: string): void,

    go(url: string, searchParams?: { [key: string]: string }): void,
}

export function NavigationProvider(props: any) {
    const navigate = useNavigate();
    const go = (url: string, searchParams: { [key: string]: string } = {}) => {
        alert('go');

        const _url = new URL(url, Config.baseUrl);
        for (let k in searchParams)
            _url.searchParams.set(k, searchParams[k]);
        navigate(`${_url.pathname}?${_url.searchParams.toString()}`);
    }
    const message = (message: string, url: string) => {
        go(url, {message});
    };

    const val: NavigationInterface = {go, message};

    return (
        <NavigationContext.Provider value={val}>
            {props.children}
        </NavigationContext.Provider>
    );
}

export function useNavigation(): NavigationInterface {
    return useContext(NavigationContext) as NavigationInterface;
}