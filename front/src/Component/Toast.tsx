import {createSignal, createContext, useContext, Show, Switch, Match} from "solid-js";
import Language from "../Core/Language";
import {BadRequest} from "../Core/Api/Response/BadRequest";

const ToastContext = createContext();

interface ToastInterface {
    makeToast(type: string, err: string, timeOut?: number): void,

    clearToast(): void,

    success(err: string, timeOut?: number): void,

    danger(err: string, timeOut?: number): void,

    firstError(e: any, timeOut?: number): void,

    warning(err: string, timeOut?: number): void,
}

export function ToastProvider(props: any) {
    const [toastType, setToastType] = createSignal('warning');

    const [errorToast, setErrorToast] = createSignal('');
    const makeToast = (type: string, err: string, timeOut = 3000) => {
        setToastType(type);
        setErrorToast('');
        setTimeout(() => setErrorToast(err), 500);
        setTimeout(() => setErrorToast(''), timeOut);
    };
    const tmp: ToastInterface = {
        makeToast,
        success(err: string, timeOut = 3000) {
            makeToast('success', err, timeOut);
        },
        danger(err: string, timeOut = 3000) {
            makeToast('danger', err, timeOut);
        },
        warning(err: string, timeOut = 3000) {
            makeToast('warning', err, timeOut);
        },
        firstError(e, timeOut = 3000) {
            let errors;
            if (e instanceof BadRequest) {
                errors = (e as BadRequest).data.errors;
                if (!!errors && typeof errors === 'object') {
                    const vals = Object.values(errors);
                    if (vals.length)
                        makeToast('danger', vals[0], timeOut);
                    else  makeToast('danger', e.data.message ?? 'error', timeOut);
                }else  makeToast('danger', e.data.message ?? 'error', timeOut);
            }
        },
        clearToast() {
            setErrorToast('');
        }
    };


    return (
        <ToastContext.Provider value={tmp}>
            <Show when={errorToast().length > 0}>
                <div
                    class="animate-[bounce_1.7s_infinite] fixed z-50 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                    role="alert">

                    <button type="button"
                            class=" -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                            onClick={() => setErrorToast('')} aria-label="Close">
                        <span class="sr-only">{Language.get('items.close')}</span>
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <div dir="rtl" class="text-sm text-center mx-auto font-normal">{errorToast()}</div>

                    <Switch fallback={
                        <div
                            class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clip-rule="evenodd"></path>
                            </svg>
                            <span class="sr-only">Warning icon</span>
                        </div>}>
                        <Match when={toastType() == 'success'}>
                            <div
                                class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span class="sr-only">Check icon</span>
                            </div>
                        </Match>
                        <Match when={toastType() == 'danger'}>
                            <div
                                class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span class="sr-only">Error icon</span>
                            </div>
                        </Match>
                    </Switch>


                </div>
            </Show>

            {props.children}

        </ToastContext.Provider>
    );
}

export function useToast(): ToastInterface {
    return useContext(ToastContext) as ToastInterface;
}