import {Component, createSignal, Show} from "solid-js";

const labelClass = `block mb-2 text-sm font-medium text-gray-900 dark:text-white`;
const invalidatedLabelClass = `block mb-2 text-sm font-medium text-red-700 dark:text-red-500`;

const inputClass = `bg-gray-50 text-gray-900 h-auto flex-shrink-0 z-10 inline-flex items-center text-sm font-medium text-center  rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300`;
const invalidatedInputClass = `bg-red-50 border border-red-500 text-red-900 h-auto flex-shrink-0 z-10 inline-flex items-center text-sm font-medium text-center  rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 `;


const TextInput: Component = (props: {
    label: string,
    placeholder?: string,
    error?: string,
    onInput(value: string | undefined): any,
    value?: string,
} | any) => {
    const [color,setColor] = createSignal(props?.value ?? "#000000");
    const label = props?.label;
    const type = props?.type ?? 'text';
    const placeholder = props?.placeholder ?? '';

    return (
        <>
            <Show when={!props?.hidden}>
                <>
                    <label class={props?.error ? invalidatedLabelClass : labelClass}>{label}</label>
                <div class="flex">
                    <div class="relative w-full">
                        <input type="text" dir="ltr" value={color()} onChange={
                            (e) => { // @ts-ignore
                                let c = e.target.value;
                                c = !!c ? c.toLowerCase() : '';
                                if(!(/^#[0-9A-F]{6}$/i.test(c)))
                                    setColor("");
                                else {
                                    setColor(c);
                                    props.onInput(c);
                                }
                            }
                        }
                               class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-100 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                               placeholder="#000000"/>
                    </div>
                    <input onInput={(e) => { // @ts-ignore
                        setColor(e.target.value);
                        props.onInput(e.target.value);
                    }} disabled={!!props?.disabled} value={color()} type="color"
                           class={props?.error ? invalidatedInputClass : inputClass} placeholder={placeholder}/>

                </div>

                    <Show when={props?.error}>
                        <p class="mt-2 text-sm text-red-600 dark:text-red-500">{props.error}</p>
                    </Show>
                </>
            </Show>
        </>
    );
}
export default TextInput;