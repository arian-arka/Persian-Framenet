import {Component, createSignal, For, Show} from "solid-js";

const labelClass = `block mb-2 text-sm font-medium text-gray-900 dark:text-white`;
const invalidatedLabelClass = `block mb-2 text-sm font-medium text-red-700 dark:text-red-500`;
const inputClass = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`;
const invalidatedInputClass = `bg-red-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700  dark:text-red-500 dark:border-red-500`;
const SelectInput: Component = (props: {
    label: string,
    error?: string,
    onInput(value: string | undefined): any,
    value?: string,
} | any) => {
    const label = props?.label;

    return (
        <>
            <Show when={!props?.hidden}>
                <Show when={!!props.label} >
                <label class={props?.error ? invalidatedLabelClass : labelClass}>{label}</label>
                </Show>
                <select disabled={!!props?.disabled} onChange={(e) => {
                    props.onInput(e.target.options[e.target.selectedIndex].value)
                }} class={props?.class ?? (props?.error ? invalidatedInputClass : inputClass)}>
                    <For each={props?.options ?? []}>{(option) =>
                        <Show when={(props?.value === 0 && option?.value == '0') || (option?.value ?? '') === (  props?.value ?? '')} fallback={
                            <option value={option?.value ?? ''}>{option.text}</option>
                        } >
                            <option selected value={option?.value ?? ''}>{option.text}</option>
                        </Show>
                    }</For>
                </select>

                <Show when={props?.error}>
                    <p class="mt-2 text-sm text-red-600 dark:text-red-500">{props.error}</p>
                </Show>

            </Show>
        </>
    );
}
export default SelectInput;






