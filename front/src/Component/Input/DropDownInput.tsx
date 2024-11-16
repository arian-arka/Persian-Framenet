import {Component, createEffect, createSignal, For, Show} from "solid-js";

const labelClass = `block mb-2 text-sm font-medium text-gray-900 dark:text-white`;
const invalidatedLabelClass = `block mb-2 text-sm font-medium text-red-700 dark:text-red-500`;
const inputClass = "block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
const invalidatedInputClass = "block w-full p-2 text-sm bg-red-50 border border-red-500 text-red-900 rounded-lg  focus:ring-red-500 focus:border-red-500 dark:bg-gray-700  dark:text-red-500 dark:border-red-500"


const DropDownInput: Component = (props: any) => {
    const [text, setText] = createSignal(props?.value ?? '');
    const allowMultiple = props?.allowMultiple === true;
    const [selected, setSelected] = allowMultiple ? createSignal([],{equals:false}) : createSignal(props?.selected ?? '') ;
    const _setSelected = (val) => setSelected(props.passThrough ? props.passThrough(val) : val);

    const appendToSelected = (val) => {
        const _ = selected();
        if(props?.unique === true){
            if(props?.customComparator){
                for(let el of selected())
                    if(props.customComparator(val,el))
                        return;
            }else if(_.includes(val))
                return;
        }
        _.push(val);
        _setSelected(_);
        props?.onSelected(_);
    }
    const deleteFromSelected = (index) => {
        const _ : any[]= selected();
        _.splice(index,1);
        _setSelected(_);
        props?.onSelected(_);
    }

    const [dropdown, setDropdown] = createSignal((props.options ?? []).length > 0)
    const label = props?.label;

    createEffect(() => {
        text();
        props.onInput(text());
        setDropdown(true);
    })

    return (
        <>
            <Show when={!props?.hidden}>
                <label class={props?.error ? invalidatedLabelClass : labelClass}>{label}</label>
                <div class="relative mb-6">
                    <input type="text" onInput={(e) => {
                        // @ts-ignore
                        setText(e.target.value);
                    }}
                           onKeyUp={(e) => {
                               e.preventDefault();
                               if(e.key === 'Alt')
                                   props?.onAlt(e,setText);
                               else if(e.key === 'Control')
                                   props?.onControl(e,setText);
                               else   if(e.key === 'Tab')
                                   props?.onTab(e,setText);
                           }}
                           onChange={(e) => {
                        if(props.onChange)
                            props.onChange(e.target.value);
                    }} value={text()}
                           class={props?.error ? invalidatedInputClass : inputClass}
                           placeholder={props?.placeholder ?? ''}/>

                    <Show when={props?.error}>
                        <p class="mt-2 text-sm text-red-600 dark:text-red-500">{props.error}</p>
                    </Show>

                    <Show when={allowMultiple ? selected().length > 0 : selected()}>
                        <Show when={Array.isArray(selected())} fallback={
                            <a onClick={(e) => {
                                _setSelected('');
                                props?.onSelected(selected());
                                setDropdown(true);
                            }}
                               class="inline-flex  items-start justify-items-start text-start  font-medium text-gray-600 dark:text-blue-500 hover:underline">
                                <svg class="w-6 h-6 ml-1 pt-1.5 " fill="currentColor"
                                     viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                {props?.customText(selected()) ?? selected()}
                            </a>
                        }>
                            <For each={selected()}>{(s,index) =>
                                <a onClick={(e) => {
                                    props?.onSelected(s);
                                    deleteFromSelected(index())
                                    if(selected().length > 0)
                                        setDropdown(true);
                                }}
                                   class="inline-flex  items-start justify-items-start text-start  font-medium text-gray-600 dark:text-blue-500 hover:underline">
                                    <svg class="w-6 h-6 ml-1 pt-1.5 " fill="currentColor"
                                         viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                              clip-rule="evenodd"></path>
                                    </svg>
                                    {props?.customText(s) ?? s}
                                </a>
                            }</For>
                        </Show>

                    </Show>

                    <div
                        class={`${dropdown() && text() && (props.options ?? []).length > 0 ? '' : 'hidden'} h-40 overflow-y-scroll mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700`}>
                        <Show when={(props.options ?? []).length > 0} fallback={
                            <div class="text-center">
                                <div role="status">
                                    <svg aria-hidden="true"
                                         class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"/>
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"/>
                                    </svg>
                                </div>
                            </div>
                        }>
                            <ul class="py-2 z-10 text-sm text-gray-700 dark:text-gray-200">
                                <For each={props.options ?? []}>{(option, i) =>
                                    <li>
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            if(Array.isArray(selected())){
                                                appendToSelected(option)
                                                //setDropdown(false);
                                            }
                                            else{
                                                _setSelected(option);
                                                props.onSelected(selected())
                                                setDropdown(false);
                                            }

                                        }}
                                                class="inline-flex  px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            {props?.customText(option) ?? option}
                                        </button>
                                    </li>
                                }</For>
                            </ul>
                        </Show>
                    </div>

                </div>

            </Show>

        </>);
}
export default DropDownInput;