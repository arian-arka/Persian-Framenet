import {Component, createEffect, createMemo, createRoot, createSignal, Show} from "solid-js";
import {A, useLocation} from "@solidjs/router";



function createMenuItem() {
    const [getter, __] = createSignal(true);
    const expand = () =>{
        __(true)
    };
    const collapse = () =>{ __(false)};

    return {getter,expand,collapse };
}
export const AsideExpander = createRoot(createMenuItem);

const MenuItem: Component = (props: any) => {
    const {getter, expand, collapse} = AsideExpander;

    const _location = useLocation();
    const [location, setLocation] = createSignal(_location.pathname);
    createMemo(() => setLocation(_location.pathname))
    const locationHas: boolean = (prefix: string) => location().startsWith(prefix);
    const locationIs: boolean = (loc: string) => location() === loc;
    const locationIsIn: boolean = (locs: string[]) => locs.includes(location());
    const locationIn: boolean = (locs: string[]) => {
        for (let u in locs)
            if (locationHas(u))
                return true;
        return false;
    };

    const activeCondition = () => {
        if(props?.condition === 'ignore')
            return false;
        if (props?.condition === 'is')
            return locationIs(props.url);
        if (props?.condition === 'isin')
            return locationIsIn(props.url);
        if (props?.condition === 'in')
            return locationIn(props.url);
        //if(props?.condition === 'in') contains- has
        return locationHas(props.url);
    }


    if (props?.children) {
        const [open, setOpen] = createSignal(false);

        createEffect(() => {
            location();
            setOpen(false)
        });
        window.onload = () => document
            .getElementById('asideOpenButton')
            .addEventListener('click', () => setOpen(false))
        return (
            <>
                <button type="button" onClick={() => setOpen(!open())}
                        class={`${activeCondition() ? 'bg-gray-100 dark:bg-gray-700' : ''} _menu_item_cls  flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                >
                    {props?.icon ?? ''}
                    <span class="mx-3">{props.text}</span>
                    <Show when={open() && getter()} fallback={
                        // <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" >
                        //     <path fill-rule="evenodd" clip-rule="evenodd" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
                        // </svg>

                        <svg aria-hidden="true" class="w-4 h-4 text-gray-400" stroke-width="2.5" fill="none"
                             stroke="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" fill-rule="evenodd" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
                        </svg>
                    }>
                        <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clip-rule="evenodd"></path>
                        </svg>
                    </Show>

                </button>
                <ul class={`${open() && getter() ? "overflow-y-auto overflow-x-auto " : "py-2 hidden"}  space-y-2 pr-2`}>
                    {props.children}
                </ul>

            </>
        );
    }

    return (
        <>
            <Show when={!props?.hidden}>
                <li>
                    <A href={props?.url ?? ''} class={`${activeCondition() ? 'bg-gray-100 dark:bg-gray-700' : ''} flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
                        {props?.icon ?? ''}
                        <span class={  `${props?.textClass ?? ''} mx-3`}>{props.text}</span>
                    </A>
                </li>
            </Show>

        </>
    );
}
export default MenuItem;

