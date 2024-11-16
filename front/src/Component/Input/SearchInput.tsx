import {Component, createSignal, Show} from "solid-js";


const SearchInput: Component = (props: {
    placeholder?: string,
    onInput(value: string | undefined): any,
    value?: string,
} | any) => {
    const [text, setText] = createSignal(props?.value ?? '');
    const type = props?.type ?? 'text';
    const placeholder = props?.placeholder ?? '';

    return (
        <>
            <Show when={!props?.hidden}>
                <div class="relative w-full">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 ">
                        <svg aria-hidden="true" class="w-5 h-5 hover:text-blue-600 text-gray-500 dark:text-gray-400" fill="currentColor" onClick={() => {
                            props?.onEnter(text())
                        }}
                             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                  clip-rule="evenodd"></path>
                        </svg>
                    </div>

                    <button onClick={() => {
                        if (!props?.disabled && text().length > 0) {
                            setText('');
                            props.onInput(text());
                        }
                    }} class="absolute inset-y-0 left-0 flex items-center pl-3">

                        <svg fill="none" stroke="currentColor"
                             class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                             stroke-width="1.5" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>

                    </button>
                    <input onInput={(e) => { // @ts-ignore
                        setText(e.target.value)
                        props.onInput(text())
                    }}
                           onKeyPress={(e) =>{
                               if(e.key === 'Enter')
                                   props?.onEnter(text())
                           }}
                           value={text()}
                           disabled={!!props?.disabled}
                           class={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                           placeholder={placeholder}/>
                </div>
            </Show>
        </>
    );
}
export default SearchInput;