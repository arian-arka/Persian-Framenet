import {Component, Show} from "solid-js";

const labelClass = `block mb-2 text-sm font-medium text-gray-900 dark:text-white`;
const invalidatedLabelClass = `block mb-2 text-sm font-medium text-red-700 dark:text-red-500`;
const inputClass = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`;
const invalidatedInputClass = `bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500`;
const TextInput: Component = (props: {
    label: string,
    type?: string,
    placeholder?: string,
    error?: string,
    onInput(value: string | undefined): any,
    value?: string,
} | any) => {
    const label = props?.label;
    const type = props?.type ?? 'text';
    const placeholder = props?.placeholder ?? '';

    return (
        <>
            <Show when={!props?.hidden}>

                    <label class={props?.error ? invalidatedLabelClass : labelClass}>{label}</label>

                    <input onInput={(e) => {
                        if(props?.onInput)
                            props.onInput(e.target.value)
                    }} onChange={(e) => {
                        if(props?.onChange)
                            props.onChange(e.target.value)
                    }}  disabled={!!props?.disabled} value={props?.value ?? ''} type={type}
                           class={props?.error ? invalidatedInputClass : inputClass} placeholder={placeholder}/>
                    <Show when={props?.error}>
                        <p class="mt-2 text-sm text-red-600 dark:text-red-500">{props.error}</p>
                    </Show>

            </Show>
        </>
    );
}
export default TextInput;