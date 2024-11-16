import {Component, Show} from "solid-js";

const labelClass = `block mb-2 text-sm font-medium text-gray-900 dark:text-white`;
const invalidatedLabelClass = `block mb-2 text-sm font-medium text-red-700 dark:text-red-500`;
const inputClass = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`;
const invalidatedInputClass = `block p-2.5 w-full text-sm text-gray-900 bg-red-50 rounded-lg border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:bg-gray-700 dark:placeholder-red-500 dark:border-red-500`;
const TextareaInput: Component = (props: {
    label: string,
    type?: string,
    placeholder?: string,
    error?: string,
    onInput(value: string | undefined): any,
    value?: string,
    disabled?: boolean,
} | any) => {
    const label = props?.label;
    const type = props?.type ?? 'text';
    const placeholder = props?.placeholder ?? '';

    return (
        <>
            <Show when={!props?.hidden}>
                <Show when={props?.disabled === true} fallback={
                    <>
                        <label class={props?.error ? invalidatedLabelClass : labelClass}>{label}</label>
                        <textarea onInput={(e) => { // @ts-ignore
                            props.onInput(e.target.value)
                        }} disabled={!!props?.disabled} class={props?.error ? invalidatedInputClass : inputClass} rows={props?.rows ?? 3}
                                  placeholder={placeholder}>
                    {props?.value ?? ''}
                </textarea>
                        <Show when={props?.error}>
                            <p class="mt-2 text-sm text-red-600 dark:text-red-500">{props.error}</p>
                        </Show>
                    </>
                }>
                    <>
                        <label class={props?.error ? invalidatedLabelClass : labelClass}>{label}</label>
                        <textarea onInput={(e) => { // @ts-ignore
                            props.onInput(e.target.value)
                        }} disabled={!!props?.disabled} class={props?.error ? invalidatedInputClass : inputClass}  rows={props?.rows ?? 3}
                                  placeholder={placeholder}>
                    {props?.value ?? ''}
                </textarea>
                        <Show when={props?.error}>
                            <p class="mt-2 text-sm text-red-600 dark:text-red-500">{props.error}</p>
                        </Show>
                    </>
                </Show>

            </Show>
        </>
    );
}
export default TextareaInput;