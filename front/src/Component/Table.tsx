import {Component, createEffect, createSignal, For, Match, Show, Switch} from "solid-js";

import Language from "../Core/Language";
import TextInput from "./Input/TextInput";
import SelectInput from "./Input/SelectInput";
import SearchInput from "./Input/SearchInput";
import {A} from "@solidjs/router";
import DropDownInput from "./Input/DropDownInput";
import FrameInterface from "../Type/Frame.interface";

const gatherFilterKeyValue = (filters: any) => {
    const data: any = {};
    for (let f of filters)
        data[f.name] = f.value;
    return data;
}
const Table: Component = (props: any) => {
    const defaultFilterValues = gatherFilterKeyValue(props?.filters ?? []);
    if (props?.searchInput)
        defaultFilterValues[props.searchInput.name] = props.searchInput.value;
    const [filterValues, setFilterValues] = createSignal<any>({...defaultFilterValues}, {equals: false});
    const [sidebar, setSidebar] = createSignal(false);
    const [loading, setLoading] = createSignal(false);
    createEffect(() => {
        props;
        setLoading(!props?.rows);
    });
    const resetFilterToDefault = () => {
        let tmp: any = {};
        if (props?.searchInput)
            tmp[props.searchInput.name] = filterValues()[props.searchInput.name];
        setFilterValues({...defaultFilterValues, ...tmp})
    };
    const setFilterValue = (key: string, val: any) => {
        const _ = filterValues();
        _[key] = val;
        setFilterValues(_);
    }
    if (props?.limits)
        setFilterValue('limit', parseInt(props.limits[0]))
    const onFilter = () => props?.onFilter(filterValues());

    const [lastOrder, setLastOrder] = createSignal(undefined, {equals: false});

    const reorder = props?.reorder;

    const checkReorder = (index) => {
        const o = lastOrder();
        console.log(o, index);
        if (o || o === 0) {
            if (index === o) {
                setLastOrder(undefined);
            } else {
                const vals = [props?.rows[o], props?.rows[index]];
                setLastOrder(undefined);
                reorder(vals, setLoading);
            }
        } else
            setLastOrder(index);
    }



    return (
        <>
            {/*<Show when={!loading() } fallback={*/}
            {/*    <div class="text-center">*/}
            {/*        <div role="status">*/}
            {/*            <svg aria-hidden="true"*/}
            {/*                 class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"*/}
            {/*                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*                <path*/}
            {/*                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"*/}
            {/*                    fill="currentColor"/>*/}
            {/*                <path*/}
            {/*                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"*/}
            {/*                    fill="currentFill"/>*/}
            {/*            </svg>*/}
            {/*            <span class="sr-only">Loading...</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}>*/}
            <div class="mx-auto max-w-screen-xl mb-2">
                <h2 class="mb-4 text-3xl leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">{props?.header ?? ''}</h2>
            </div>

            <Show when={sidebar()}>
                <div
                    // class="fixed top-0 left-0 z-20 w-full h-screen max-w-xs p-4 transition-transform -translate-x-full bg-white dark:bg-gray-800"
                    class="fixed top-0 left-0 z-40 w-full h-screen max-w-xs p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 transform-none"
                    tabIndex="-1" aria-labelledby="drawer-label" aria-hidden="true">
                    <h5 id="drawer-label"
                        class="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">فیلتر</h5>
                    <button onClick={resetFilterToDefault}
                            class="p-1.5 absolute top-2.5 left-5 inline-flex items-center text-pink-500 bg-white   font-medium rounded-lg  text-sm px-5   text-center dark:bg-primary-600 dark:focus:ring-primary-800">
                        پیش فرض
                    </button>
                    <button onClick={() => setSidebar(false)}
                            aria-controls="drawer-create-product-default"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 left-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <div class="space-y-4">
                        <For each={props?.filters ?? []}>
                            {(filter) =>
                                <>
                                    <Switch>
                                        <Match when={filter?.type === 'dropdown'}>
                                            <DropDownInput
                                                type="dropdown"
                                                label={filter?.label}
                                                value=''
                                                options={filter?.options ?? []}
                                                placeholder={filter?.placeholder ?? ""}
                                                customText={filter?.customText}
                                                customComparator={filter?.customComparator}
                                                onInput={filter?.onInput}
                                            />
                                        </Match>
                                        <Match when={filter?.type === 'text'}>
                                            <TextInput
                                                placeholder={filter.placeholder}
                                                label={filter.label}
                                                type="text"
                                                value={`${filterValues()[filter.name]}`}
                                                onInput={(val: any) => setFilterValue(filter.name, val)}
                                            />
                                        </Match>
                                        <Match when={filter?.type === 'select'}>
                                            <SelectInput
                                                label={filter.label}
                                                value={`${filterValues()[filter.name]}`}
                                                onInput={(val: any) => setFilterValue(filter.name, val)}
                                                options={filter.options}
                                            />
                                        </Match>
                                    </Switch>
                                </>
                            }
                        </For>

                        <div
                            class="gap-2 bottom-0 left-0 flex justify-center w-full pb-4 space-x-4 md:px-4 ">
                            <button onClick={() => {
                                setSidebar(false);
                                onFilter();
                            }}
                                    class="text-white w-full justify-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                {Language.get('table.applyFilter')}
                            </button>

                            <button onClick={() => setSidebar(false)}
                                    class="inline-flex w-full justify-center text-gray-500 items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                {Language.get('table.cancelFilter')}
                                <svg aria-hidden="true" class="w-5 h-5 -ml-1 sm:mr-1" fill="none"
                                     stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M6 18L18 6M6 6l12 12"></path>
                                </svg>

                            </button>
                        </div>
                    </div>
                </div>

            </Show>

            <div class="mx-auto max-w-screen-xl mb-2">

                <div class="dark:bg-gray-700   sm:rounded-lg ">

                    <div class="flex flex-col items-center justify-start space-y-2 md:flex-row md:space-y-0 space-x-2">

                        <Show when={props?.filters}>
                            <button onclick={() => setSidebar(true)}
                                    class="lg:ml-6 md:ml-6   w-full lg:w-1/5 md:w-1/5 sm:w-full flex items-center justify-center  px-1 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                فیلتر
                                <svg aria-hidden="true" class="h-4 w-4 mr-2  "
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                          clip-rule="evenodd"></path>
                                </svg>

                            </button>
                        </Show>
                        <For each={props?.buttons ?? []}>{(b) => b}</For>
                        <Show when={props?.addButton}>
                            <Show when={props.addButton.callback} fallback={
                                <A href={props.addButton.link()} target="_blank"
                                        class="lg:ml-6 md:ml-6   w-full lg:w-1/5 md:w-1/5 sm:w-full flex items-center justify-center  px-1 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                    {props.addButton.text}
                                </A>
                            } >

                            <button onClick={props.addButton.callback}
                                    class="lg:ml-6 md:ml-6   w-full lg:w-1/5 md:w-1/5 sm:w-full flex items-center justify-center  px-1 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                {props.addButton.text}
                            </button>
                            </Show>

                        </Show>
                        <Show when={props?.searchInput}>
                            <SearchInput
                                onEnter={(val) => {
                                    setFilterValue(props.searchInput.name, val);
                                    props?.onFilter(filterValues())
                                }}
                                placeholder={props.searchInput.placeholder}
                                value={filterValues()[props.searchInput.name]}
                                onInput={(val: any) => setFilterValue(props.searchInput.name, val)}
                            />
                        </Show>


                        <Show when={props?.limits}>
                            <div class="inline-flex items-center">
                                <select disabled={!!props?.disabled} onChange={(e) => {
                                    setFilterValue('limit', parseInt(e.target.options[e.target.selectedIndex].value));
                                    onFilter();
                                }}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5  "
                                >
                                    <For each={props.limits}>{(l) =>
                                        <option value={l}>{l}</option>
                                    }</For>
                                </select>

                            </div>
                        </Show>

                        <div class="w-full">
                            <Show when={props?.rows?.length ?? 0}>
                             <span class="inline-block text-sm font-normal text-gray-500 dark:text-gray-400">
                                 {Language.get('table.paginationNumbers', props?.rows.length ?? 0, ...(props?.pagination ? [props?.pagination.totalSoFar, props?.pagination.total] : []))}
                            </span>
                            </Show>
                        </div>
                        <div class="w-full lg:w-1/5 md:w-1/5 sm:w-full"></div>

                    </div>


                </div>

            </div>

            <div class="mx-auto max-w-screen-xl ">

                {/*
                props.pagination
                props.rows
                props.actions
                */}
                <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">


                    <div class="overflow-x-auto">
                        <Show when={!loading()} fallback={
                            <div class="text-center m-3">
                                <div role="status">
                                    <svg aria-hidden="true"
                                         class="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"/>
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"/>
                                    </svg>
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                        }>
                            <table class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                                <thead
                                    class="border dark:border-gray-800 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr class="">
                                    <Show when={reorder}>
                                        <th scope="col" class="px-4 py-3">#</th>
                                    </Show>
                                    <For each={props?.columns ?? []}>
                                        {(col) => <th scope="col" class="px-4 py-3">{col.text}</th>}
                                    </For>
                                    <Show when={(props?.actions ?? []).length > 0}>
                                        <th scope="col" class="px-4 py-3">{props?.actionColumn ?? Language.get('table.actionsText')}</th>
                                    </Show>

                                </tr>
                                </thead>
                                <tbody>

                                <For each={props?.rows ?? []}>
                                    {(row, index) =>

                                        <tr class="border-b dark:border-gray-700">
                                            <Show when={reorder}>
                                                <th scope="col" class="px-4 py-3">
                                                    <button onClick={() => checkReorder(index())}
                                                            class={`${lastOrder() === index() ? 'text-primary-600' : 'text-gray-500 '} inline-flex items-center p-0.5 text-sm font-medium text-center hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100`}>
                                                        <svg
                                                            class={`${lastOrder() === index() ? 'text-primary-600' : 'text-gray-500 '} flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white`}
                                                            fill="none" stroke="currentColor" stroke-width="1.5"
                                                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                                            aria-hidden="true">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                                                        </svg>
                                                    </button>
                                                </th>
                                            </Show>
                                            <For each={props?.columns ?? []}>
                                                {(col) =>
                                                    <td class="px-4 py-3">
                                                        {col?.customValue ? col.customValue(row[col.key], row, index()) : row[col.key]}
                                                    </td>
                                                }
                                            </For>
                                            <Show when={(props?.actions ?? []).length > 0}>
                                                <td class="px-4 py-3 flex items-center justify-center">
                                                    <For each={props?.actions ?? []}>{(action) =>
                                                        <Show when={!!action?.link} fallback={
                                                            <button onClick={() => {
                                                                if (action?.click)
                                                                    action.click(row);
                                                            }}
                                                                    class={action?.class ?? 'inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100'}>
                                                                {action?.text ?? ''}
                                                            </button>
                                                        }>
                                                            <A href={action?.link(row)} target="_blank"
                                                               class={action?.class ?? 'inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100'}>
                                                                {action?.text ?? ''}
                                                            </A>

                                                        </Show>
                                                    }</For>
                                                </td>
                                            </Show>
                                        </tr>
                                    }
                                </For>

                                </tbody>
                            </table>
                        </Show>
                    </div>

                    <nav
                        class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                        aria-label="Table2 navigation">
                        <Show when={props?.rows?.length ?? 0}>
                             <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                                 {Language.get('table.paginationNumbers', props?.rows.length ?? 0, ...(props?.pagination ? [props?.pagination.totalSoFar, props?.pagination.total] : []))}
                            </span>
                        </Show>
                        <Show when={props?.pagination && props?.rows && props.rows.length > 0}>
                            <ul class="inline-flex items-stretch -space-x-px">
                                <Show when={props?.pagination?.firstPage}>
                                    <li>
                                        <a onClick={() => props?.onPage(props?.pagination.firstPage)}
                                           class="cursor-pointer flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white   hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                            {Language.get('table.paginationFirstPage')}
                                        </a>
                                    </li>
                                </Show>
                                <Show when={props?.pagination?.previous}>
                                    <li>
                                        <a onClick={() => props?.onPage(props?.pagination.previous)}
                                           class="cursor-pointer flex items-center justify-center py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                            <span class="sr-only">{Language.get('table.paginationPrevious')}</span>
                                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor"
                                                 viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                      clip-rule="evenodd"></path>
                                            </svg>
                                        </a>
                                    </li>
                                </Show>
                                <For each={props?.pagination?.pages ?? []}>{(page) =>
                                    <li>
                                        <Show when={page == props?.pagination.current} fallback={
                                            <a onClick={() => props?.onPage(page)} class={
                                                     'cursor-pointer flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                            }>{page}</a>
                                        }>
                                                <input onChange={(e) => {
                                                    const v = e.target.value;
                                                    try{
                                                        const parsed = parseInt(v);
                                                        if(parsed>0 && props?.pagination?.lastPage && parsed <= props?.pagination?.lastPage)
                                                            props?.onPage(parsed);
                                                        else
                                                            e.target.value = page;
                                                    }catch (e){
                                                        e.target.value = page;
                                                    }
                                                }} type="text" value={page} style="height:35px" class="text-center float-left w-12 flex items-center justify-center text-gray-900  border border-gray-300  bg-gray-50 sm:text-md  "/>
                                        </Show>
                                    </li>
                                }
                                </For>
                                <Show when={props?.pagination?.next}>
                                    <li>
                                        <a onClick={() => props?.onPage(props?.pagination.next)}
                                           class="cursor-pointer flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                            <span class="sr-only">{Language.get('table.paginationNext')}</span>
                                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor"
                                                 viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                      clip-rule="evenodd"></path>
                                            </svg>
                                        </a>
                                    </li>
                                </Show>
                                <Show when={props?.pagination?.lastPage}>
                                    <li>
                                        <a onClick={() => props?.onPage(props?.pagination.lastPage)}
                                           class="cursor-pointer flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                            {Language.get('table.paginationLastPage')}
                                        </a>
                                    </li>
                                </Show>
                            </ul>
                        </Show>
                    </nav>
                </div>
            </div>

            {/*</Show>*/}
        </>
    )
}

export default Table;