import {Component, createSignal, For, Match, Show, Switch} from "solid-js";
import TextInput from "./Input/TextInput";
import ColorInput from "./Input/ColorInput";
import TextareaInput from "./Input/TextareaInput";
import SelectInput from "./Input/SelectInput";
import DropDownInput from "./Input/DropDownInput";

const gatherInputKeyValue = (filters: any) => {
    const data: any = {};
    for (let fs of filters)
        for (let f of fs)
            data[f.name] = f.value;
    return data;
}
const Form: Component = (props: any) => {
    const defaultInputValues = gatherInputKeyValue(props?.inputs ?? []);
    const [loading, setLoading] = createSignal<boolean>(false);
    const [inputValues, setInputValues] = createSignal<any>({...defaultInputValues}, {equals: false});
    const [showDelete,setShowDelete] = createSignal(false);
    const resetInputsToDefault = () => setInputValues({...defaultInputValues})
    const onInput = (key: string, value: any) => props?.onInput(key, value);

    const setInputValue = (key: string, val: any) => {
        onInput(key, val);
        const _ = inputValues();
        _[key] = val;
        setInputValues(_);
    }
    const onSubmit = () =>  props?.onSubmit(inputValues(),setLoading);
    const onDelete = () => props?.onDelete(setLoading);

    return (<>

        <div
            class="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">

            {props?.header ?? ''}

            <For each={props?.inputs ?? []}>{(_inputs) =>
                <div
                    class={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-${_inputs.length} lg:grid-cols-${_inputs.length} sm:gap-6`}>


                    <For each={_inputs}>{(inp) =>
                        <div class="w-full">

                            <Switch>

                                <Match when={['text', 'password'].includes(inp.type)}>
                                    <TextInput
                                        label={inp?.label}
                                        type={inp.type}
                                        placeholder={inp?.placeholder ?? ''}
                                        value={inp?.value ?? ''}
                                        onInput={(val: any) => setInputValue(inp.name, val)}
                                        error={props?.errors ? props.errors[inp.name] : ''}
                                    />
                                </Match>

                                <Match when={inp.type === 'color'}>
                                    <ColorInput
                                        label={inp?.label}
                                        value={inp?.value ?? ''}
                                        onInput={(val: any) => setInputValue(inp.name, val)}
                                        error={props?.errors ? props.errors[inp.name] : ''}
                                    />
                                </Match>

                                <Match when={inp.type === 'textarea'}>
                                    <TextareaInput
                                        label={inp?.label}
                                        type={inp.type}
                                        placeholder={inp?.placeholder ?? ''}
                                        value={inp?.value ?? ''}
                                        onInput={(val: any) => setInputValue(inp.name, val)}
                                        error={props?.errors ? props.errors[inp.name] : ''}
                                    />
                                </Match>

                                <Match when={inp.type === 'select'}>
                                    <SelectInput
                                        label={inp?.label}
                                        value={inp?.value ?? ''}
                                        onInput={(val: any) => setInputValue(inp.name, val)}
                                        error={props?.errors ? props.errors[inp.name] : ''}
                                        options={inp?.options ?? []}
                                    />
                                </Match>

                                <Match when={inp.type === 'dropdown'}>
                                    <DropDownInput
                                        unique={inp?.unique ?? true}
                                        allowMultiple={inp?.allowMultiple ?? false}
                                        options={inp?.options() ?? []}
                                        selected={inp?.selected}
                                        label={inp?.label}
                                        placeholder={inp?.placeholder ?? ''}
                                        customText={inp?.customText}
                                        customComparator={inp?.customComparator}
                                        onSelected={(val) => {
                                            setInputValue(inp.name, val)
                                        }}
                                        onInput={inp.onInput}
                                        error={props?.errors ? props.errors[inp.name] : ''}
                                    />
                                </Match>


                            </Switch>

                        </div>
                    }</For>
                </div>
            }</For>


        <Show when={loading()}
                  fallback={
                      <>
                          <div  style="right:40%"
                               class={`${showDelete() ? '' : 'hidden'} fixed top-1/3 z-50  p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full `}>
                              <div class=" w-full ">
                                  <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                      <button type="button" onClick={()=>setShowDelete(false)}
                                              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                              data-modal-hide="popup-modal">
                                          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor"
                                               viewBox="0 0 20 20"
                                               xmlns="http://www.w3.org/2000/svg">
                                              <path fill-rule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clip-rule="evenodd"></path>
                                          </svg>
                                          <span class="sr-only">Close modal</span>
                                      </button>
                                      <div class="p-6 text-center">
                                          <svg aria-hidden="true"
                                               class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                                               fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                               xmlns="http://www.w3.org/2000/svg">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                          </svg>
                                          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">آیا از انجام این کار اطمینان دارید؟</h3>

                                          <button data-modal-hide="popup-modal" type="button"
                                                  onClick={() => setShowDelete(false)}
                                                  class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center ml-2">
                                              بازگشت
                                          </button>

                                          <button data-modal-hide="popup-modal" type="button" onClick={onDelete}
                                                  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                              بله، حتما
                                          </button>

                                      </div>
                                  </div>
                              </div>
                          </div>

                          <Show when={props?.onDelete}>
                              <>

                                  <button data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="button"
                                          onClick={()=>setShowDelete(true)}
                                          class="m-1 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-600 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800">
                                      حذف
                                  </button>
                                  </>


                          </Show>
                          <button onClick={onSubmit}
                                  class="m-1 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                              ثبت
                          </button>
                      </>
                  }
            >
                <button disabled type="button"
                        class="mt-4 py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">

                    <svg aria-hidden="true" role="status"
                         class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"/>
                    </svg>
                    Loading...
                </button>
            </Show>


        </div>

    </>)
}
export default Form;