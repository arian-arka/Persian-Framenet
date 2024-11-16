import {Component, createEffect, createMemo, createSignal, For, Match, Show, Switch} from "solid-js";
import {A, useNavigate, useParams} from "@solidjs/router";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {useLocalData} from "../../Core/LocalData";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {ELEMENT_TYPE} from "../../Constant/Element";
import {LEXICAL_UNIT_TYPE} from "../../Constant/LexicalUnit";
import FrameApi from "../../Api/Frame.api";
import FrameInterface, {FullFrameInterface} from "../../Type/Frame.interface";
import {FRAME_STATUS} from "../../Constant/Frame";
import {USER_PRIVILEGES} from "../../Constant/User";
import ElementApi from "../../Api/Element.api";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import {useToast} from "../../Component/Toast";
import TextareaInput from "../../Component/Input/TextareaInput";
import Language from "../../Core/Language";

const ColorizeText = (props: any) => {

    const words = props.text.split(/\s+/);

    const elementsByColor = props.elementsByColor;
    console.log('############## colorizing');
    console.log(props);
    return (
        <>
            <For each={words}>
                {(word) =>
                    <Show when={word.length !== 0}>
                        <Show when={word in elementsByColor} fallback={word + ' '}>
                            <span
                                style={props?.background ? `background-color:${elementsByColor[word]} !important;color:white!important` :  `background-color:white !important;color:${elementsByColor[word]}!important`}>{word + ' '}</span>
                        </Show>
                    </Show>
                }
            </For>
        </>
    );
}
const makeElementsColors = (elements: any) => {
    const colors: any = {};
    for (let el of elements)
        colors[el.name] = el.color;
    return colors;
}
const Frame: Component = () => {
    const toast = useToast();
    const params = useParams<{ frame: string }>();
    const localData = useLocalData();
    const navigate = useNavigate();
    const [loading, setLoading] = createSignal(false);
    const [frame, setFrame] = createSignal<any>(undefined, {equals: false});
    const [softDeleted, setSoftDeleted] = createSignal<boolean>(false, {equals: false});
    const [elementsColor, setElementsColor] = createSignal<any>({}, {equals: false});
    const [mirrorElementsColor, setMirrorElementsColor] = createSignal<any>({}, {equals: false});
    const [modal, setModal] = createSignal<number>(0);
    const [modalMessage, setModalMessage] = createSignal('');
    const fetch = async () => {
        await (new FrameApi()).full(params.frame).forever({
            ok(r: Ok<FullFrameInterface>) {
                Log.success('r', r);

                setElementsColor(makeElementsColors(r.data?.elements ?? []));

                if (r.data.mirror)
                    setMirrorElementsColor(makeElementsColors((r.data.mirror as FullFrameInterface)?.elements ?? []));
                setSoftDeleted(!!r.data.deletedAt);
                setFrame(r.data)

                console.log('@@@@@@@@@@@@22', elementsColor(), mirrorElementsColor());
            },
            unAuthenticated(r: BadRequest) {
                localData.navigate('/login');
            },
        });
    }

    createEffect(async () => await fetch(params));

    const changeFrameStatus = (message: string, status: number) => {
        const _ = frame();
        _['status'] = status;
        _['message'] = message;
        setFrame(_);
    }
    const changeStatus = async (status: number) => {
        setLoading(true);
        try {
            const ok = await (new FrameApi()).status(params.frame, status).fetch();
            changeFrameStatus('', status);
        } catch (e) {
            console.log(e);
            if (isBadRequest(e)) {
            } else if (isUnauthenticated(e))
                localData.navigate('/login');
            else if (isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        } finally {
            setLoading(false);
        }
    }
    const publishFrame = async (message: string, status: number) => {
        setLoading(true);
        try {
            const ok = await (new FrameApi()).publish(params.frame,
                {status, 'message': message.length === 0 ? undefined : message}
            ).fetch();
            changeFrameStatus(message, status);
        } catch (e) {
            console.log(e);
            if (isBadRequest(e)) {
            } else if (isUnauthenticated(e))
                localData.navigate('/login');
            else if (isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        } finally {
            setLoading(false);
        }
    }
    const duplicate = async () => {
        setLoading(true);
        try {
            const ok = await (new FrameApi()).duplicate(params.frame).fetch();
            navigate(`/frame/edit/${ok.data._id}`);
            toast.success('قالب معنایی کپی شد.');
        } catch (e) {
            console.log(e);
            if (isBadRequest(e)) {
            } else if (isUnauthenticated(e))
                localData.navigate('/login');
            else if (isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        } finally {
            setLoading(false);
        }
    }
    const softDelete = async (status: boolean) => {
        setLoading(true);
        try {
            const ok = await (new FrameApi()).softDelete(params.frame, status).fetch();
            setSoftDeleted( status);
        } catch (e) {
            console.log(e);
            if (isBadRequest(e)) {
            } else if (isUnauthenticated(e))
                localData.navigate('/login');
            else if (isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        } finally {
            setLoading(false);
        }
    }

    createEffect(() => {
        document.title = frame().name ?? 'قالب معنایی';
    });
    return (
        <>
            <Show when={!loading() && frame()} fallback={
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
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            }>
                <div class={
                    modal() !== 0 ?
                        'fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full justify-center items-center flex' :
                        'fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full justify-center items-center hidden'
                }>
                    <div class="relative w-full h-full max-w-md md:h-auto">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button onClick={() => setModal(0)}
                                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                    data-modal-hide="authentication-modal">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{
                                    FRAME_STATUS['published'] === modal() ? 'تایید' : 'رد'
                                }</h3>
                                <form class="space-y-6">
                                    <div>
                                        <TextareaInput
                                            value={modalMessage()}
                                            label={'پیام'}
                                            placeholder={'پیام...'}
                                            onInput={(val) => setModalMessage(val)}
                                            error={''}
                                        />
                                    </div>


                                    <button onClick={async () => {
                                        const msg = modalMessage();
                                        setModalMessage('');
                                        const status = modal() === FRAME_STATUS['published'] ? FRAME_STATUS['published'] : FRAME_STATUS['refused'];
                                        setModal(0);
                                        await publishFrame(msg, status);
                                    }
                                    }
                                            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        ثبت
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                <section class="bg-white dark:bg-gray-900">
                    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6 mb-8 lg:mb-12">

                        <div class={`${frame()?.mirror && frame().lang === 2 && 'lg:grid-cols-2'} grid`}>
                            <Show when={frame()?.mirror && frame().lang === 2} fallback={<div
                                class="bg-gray-50 border-b border-gray-200  lg:border-r dark:bg-gray-800 dark:border-gray-700 relative   overflow-hidden">

                            </div>}>
                                <figure dir={frame().mirror.lang === 1 ? 'ltr' : 'rtl'}
                                        class="flex flex-col  items-center p-2  bg-gray-50 border-b dark:border-gray-700 lg:border-r border-gray-200 md:p-3  dark:bg-gray-800 ">
                                    <blockquote class="mx-auto mb-1 max-w-2xl text-gray-500 dark:text-gray-400">

                                        <h2 class="mb-2 text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                            {frame().mirror.name}
                                            {/* <span
                                                class="text-xl  text-primary-300">({frame().mirror.lang == 2 ? 'fa' : 'en'})</span>*/}
                                        </h2>
                                        <p class="mb-2 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                                            <Switch>
                                                <Match when={FRAME_STATUS['published'] === frame().mirror.status}>
                                                    <span class="text-green-500">نهایی</span>
                                                </Match>
                                                <Match when={FRAME_STATUS['refused'] === frame().mirror.status}>
                                                    <span class="text-red-600">رد</span>
                                                </Match>
                                                <Match when={FRAME_STATUS['editing'] === frame().mirror.status}>
                                                    <span class="text-yellow-300">در حال ویرایش</span>
                                                </Match>
                                                <Match when={FRAME_STATUS['waiting'] === frame().mirror.status}>
                                                    <span class="text-orange-500">در انتظار بررسی</span>
                                                </Match>
                                                <Match when={FRAME_STATUS['unchanged'] === frame().mirror.status}>
                                                    <span class="text-gray-500">بدون تغییر</span>
                                                </Match>
                                            </Switch>
                                        </p>


                                        <p class="my-4 text-sm" style="text-align: start;"><ColorizeText
                                            background={false}
                                            elementsByColor={mirrorElementsColor()}
                                            text={frame().mirror.definition}/>
                                        </p>
                                        <Show when={frame().mirror.semanticType}>
                                            <p class="my-4 text-sm" style="text-align: start;">
                                            <span class="font-bold">
                                                Semantic Type:
                                            </span>
                                                {` ${frame().mirror.semanticType} `}
                                            </p>
                                        </Show>
                                    </blockquote>
                                </figure>

                            </Show>


                            <figure dir={frame().lang == 1 ? 'ltr' : 'rtl'}
                                    class={`flex flex-col  items-center p-2  bg-gray-50 md:p-3 dark:bg-gray-800 ${frame()?.mirror && 'border-b border-gray-200  lg:border-r dark:border-gray-700'} `}>
                                <blockquote class="mx-auto mb-1 max-w-2xl text-gray-500 dark:text-gray-400">
                                    <h2 class="mb-2 text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                        {frame().name}
                                        {/*<span*/}
                                        {/*    class="text-xl  text-primary-300">({frame().lang == 2 ? 'fa' : 'en'})</span>*/}
                                    </h2>
                                    <p class="mb-2 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                                        <Switch>
                                            <Match when={FRAME_STATUS['published'] === frame().status}>
                                                <span class="text-green-500">نهایی</span>
                                            </Match>
                                            <Match when={FRAME_STATUS['refused'] === frame().status}>
                                                <span class="text-red-600">رد</span>
                                            </Match>
                                            <Match when={FRAME_STATUS['editing'] === frame().status}>
                                                <span class="text-yellow-300">در حال ویرایش</span>
                                            </Match>
                                            <Match when={FRAME_STATUS['waiting'] === frame().status}>
                                                <span class="text-orange-500">در انتظار بررسی</span>
                                            </Match>
                                            <Match when={FRAME_STATUS['unchanged'] === frame().status}>
                                                <span class="text-gray-500">بدون تغییر</span>
                                            </Match>
                                        </Switch>
                                    </p>

                                    <p class="my-4 text-sm" style="text-align: start;">
                                        <ColorizeText elementsByColor={elementsColor()} background={false} text={frame().definition}/>
                                    </p>

                                    <Show when={frame().semanticType}>
                                        <p class="my-4 text-sm" style="text-align: start;">
                                            <span class="font-bold">
                                                {frame().lang === 2 ? 'گونه معنایی:' : 'Semantic Type:'}
                                            </span>
                                            {` ${frame().semanticType} `}
                                        </p>


                                    </Show>
                                </blockquote>
                            </figure>


                            <Show when={frame()?.mirror && frame().lang === 2} fallback={<div
                                class="bg-gray-50 border-b border-gray-200  lg:border-r dark:bg-gray-800 dark:border-gray-700 relative   overflow-hidden"></div>}>
                                <figure dir={frame().mirror.lang === 1 ? 'ltr' : 'rtl'}
                                        class={`${frame().mirror.lang === 1 && 'ltr'} flex flex-col justify-start items-start p-2 text-center bg-gray-50 border-b border-gray-200 lg:border-b-0 md:p-3 lg:border-r dark:bg-gray-800 dark:border-gray-700`}>
                                    <blockquote class="mx-auto mb-1 max-w-2xl text-gray-500 dark:text-gray-400">
                                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            Elements
                                        </h3>

                                        <For each={frame().mirror.elements}>
                                            {
                                                (element) =>
                                                    <>

                                                        <p class="my-2 text-xl divide-y divide-gray-200"
                                                           style={` text-align: start;`}
                                                        >
                                                             <span
                                                                 style={`background-color:${element.color} !important;color:white!important;`}>
                                                            {element.name}
                                                                 {/*{!!element?.abbreviation ? `[${element?.abbreviation}]` : ''}*/}
                                                        </span>
                                                        </p>
                                                        <p class="my-2 text-sm divide-y divide-gray-200 "
                                                           style={`text-align: start;`}>
                                                            <span
                                                                class="font-bold">{frame().mirror.lang === 1 ? 'Status' : 'وضعیت'}</span>: {frame().mirror.lang === 1 ? Object.keys(ELEMENT_TYPE)[Object.values(ELEMENT_TYPE).indexOf(element.type)] : Language.get(`element.type.${Object.keys(ELEMENT_TYPE)[Object.values(ELEMENT_TYPE).indexOf(element.type)]}`)}
                                                        </p>
                                                        <Show when={!!element.excludes}>
                                                            <p class="my-2 text-sm  divide-y divide-gray-200"
                                                               style={`text-align: start;`}>

                                                                <span
                                                                    class="font-bold">{frame().mirror.lang === 1 ? 'Excludes' : 'مانع می‌شود از'}</span>: {element.excludes}
                                                            </p>
                                                        </Show>
                                                        <Show when={element.semanticType}>
                                                            <p class="my-2 text-sm  divide-y divide-gray-200"
                                                               style={`text-align: start;`}>
                                                                  <span class="font-bold">
                                                Semantic Type:
                                            </span>
                                                                {` ${element.semanticType} `}

                                                            </p>
                                                        </Show>
                                                        <p class="my-2 pb-4 text-sm  divide-y divide-gray-200 border-b-2 border-indigo-500 border-dashed border-sky-500 "
                                                           style="text-align: start;">
                                                            <ColorizeText text={element.definition} background={false}
                                                                          elementsByColor={mirrorElementsColor()}/>
                                                        </p>
                                                    </>
                                            }
                                        </For>


                                    </blockquote>

                                </figure>
                            </Show>


                            <figure dir={frame().lang === 1 ? 'ltr' : 'rtl'}
                                    class={`flex flex-col  items-center p-2 text-center bg-gray-50 md:p-3 dark:bg-gray-800 ${frame()?.mirror && 'border-b border-gray-200  lg:border-r dark:border-gray-700'} `}>
                                <blockquote class="mx-auto mb-1 max-w-2xl text-gray-500 dark:text-gray-400">
                                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {frame().lang === 2 ? 'اجزای معنایی' : 'Elements'}
                                    </h3>
                                    <For each={frame().elements}>
                                        {
                                            (element) =>
                                                <>

                                                    <p class="my-2 text-xl divide-y divide-gray-200"
                                                       style={` text-align: start;`}
                                                    >
                                                        <span
                                                            style={`background-color:${element.color} !important;color:white!important;`}>
                                                            {element.name}
                                                            {/*{!!element?.abbreviation ? `[${element?.abbreviation}]` : ''}*/}
                                                        </span>
                                                    </p>
                                                    <p class="my-2 text-sm divide-y divide-gray-200 "
                                                       style={`text-align: start;`}>
                                                        <span
                                                            className="font-bold">{frame().lang === 1 ? 'Status' : 'وضعیت'}</span>: {frame().lang === 1 ? Object.keys(ELEMENT_TYPE)[Object.values(ELEMENT_TYPE).indexOf(element.type)] : Language.get(`element.type.${Object.keys(ELEMENT_TYPE)[Object.values(ELEMENT_TYPE).indexOf(element.type)]}`)}
                                                    </p>
                                                    <Show when={!!element.excludes}>
                                                        <p class="my-2 text-sm divide-y divide-gray-200 "
                                                           style={`text-align: start;`}>
                                                            <span
                                                                className="font-bold">{frame().lang === 1 ? 'Excludes' : 'مانع می‌شود از'}</span>: {element.excludes}
                                                        </p>
                                                    </Show>
                                                    <Show when={element.semanticType}>
                                                        <p class="my-2 text-sm divide-y divide-gray-200"
                                                           style={`text-align: start;`}>
                  <span class="font-bold">
                                           {frame().lang === 2 ? 'گونه معنایی:' : 'Semantic Type:'}
                                            </span>
                                                            {` ${element.semanticType} `}

                                                        </p>
                                                    </Show>
                                                    <p class="my-2 pb-4 text-sm divide-y divide-gray-200 border-b-2 border-indigo-500 border-dashed border-sky-500 "
                                                       style="text-align: start;">
                                                        <ColorizeText text={element.definition} background={false}
                                                                      elementsByColor={elementsColor()}/>
                                                    </p>
                                                </>
                                        }
                                    </For>

                                </blockquote>

                            </figure>

                        </div>

                        <div
                            class={`grid grid-cols-1 ${frame()?.mirror && frame().lang === 2 ? 'lg:grid-cols-2 md:grid-cols-2' : 'lg:grid-cols-1 md:grid-cols-1'} sm:grid-cols-1`}>
                            <Show when={frame()?.mirror && frame().lang === 2 }
                                  fallback={<div class="  relative   overflow-hidden"></div>}>
                                <div dir="ltr"
                                     class="  md:p-3  relative   overflow-hidden">
                                    <div
                                        class="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4 p-4">
                                        <div
                                            class="w-full md:w-auto text-center flex flex-col  md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-center md:space-x-3 flex-shrink-0">
                                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                                Frame-frame Relations
                                            </h3>
                                        </div>
                                    </div>
                                    <div class="overflow-x-auto">
                                        <table
                                            class="w-full text-sm text-start text-gray-500 dark:text-gray-400">
                                            <thead
                                                class=" text-xs text-gray-700 uppercase  dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="px-6 py-3 rounded-l-lg">
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            <For each={Object.keys(frame()?.mirror?.relations)}>{(relationName) =>
                                                <tr class="border-b dark:border-gray-700">
                                                    <td class="px-4 py-3">{frame()?.mirror.lang === 1 ? relationName : Language.get(`frameRelations.types.${relationName}`)}</td>
                                                    <td class="px-4 py-3">
                                                        <For each={frame()?.mirror?.relations[relationName]}>{(r) =>

                                                            <A target="_blank"
                                                               class="font-medium text-blue-600 dark:text-blue-500 hover:underline inactive"
                                                               href={`/frame/${r.toFrame._id}`}>{` ${r.toFrame.name} `}</A>

                                                        }</For>
                                                    </td>
                                                </tr>
                                            }</For>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Show>
                            <div dir={frame().lang === 2 ? 'ltr' : 'rtl'}
                                 class={`relative md:p-3 overflow-hidden ${frame()?.mirror && ''}  `}>
                                <div
                                    class="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4 p-4">
                                    <div
                                        class="w-full md:w-auto text-center flex flex-col  md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-center md:space-x-3 flex-shrink-0">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                            {frame().lang === 2 ? 'روابط بیناقالبی' : 'Frame-frame Relations'}

                                        </h3>
                                    </div>
                                </div>
                                <div class="overflow-x-auto">
                                    <table dir={frame().lang === 2 ? 'rtl' : 'ltr'}

                                           class={`w-full text-sm ${frame().lang === 2 ? 'text-start' : 'text-center'} text-gray-500 dark:text-gray-400 rtl`}>
                                        <thead
                                            class=" text-xs text-gray-700 uppercase  dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 rounded-l-lg">
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        <For each={Object.keys(frame()?.relations)}>{(relationName) =>
                                            <tr class="border-b dark:border-gray-700">
                                                <td class="px-4 py-3">{frame()?.lang === 1 ? relationName : Language.get(`frameRelations.types.${relationName}`)}</td>
                                                <td class="px-4 py-3">
                                                    <For each={frame()?.relations[relationName]}>{(r) =>

                                                        <A target="_blank"
                                                           class="font-medium text-blue-600 dark:text-blue-500 hover:underline inactive"
                                                           href={`/frame/${r.toFrame._id}`}>{` ${r.toFrame.name} `}</A>
                                                    }</For>
                                                </td>
                                            </tr>
                                        }</For>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div
                            class={`grid grid-cols-1 ${frame()?.mirror && frame().lang === 2 ? 'lg:grid-cols-2 md:grid-cols-2' : 'lg:grid-cols-1 md:grid-cols-1'} sm:grid-cols-1`}>
                            <Show when={frame()?.mirror && frame().lang === 2 }
                                  fallback={<div class="  relative   overflow-hidden"></div>}>
                                <div dir="ltr"
                                     class="  md:p-3  relative   overflow-hidden">
                                    <div
                                        class="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4 p-4">
                                        <div
                                            class="w-full md:w-auto text-center flex flex-col  md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-center md:space-x-3 flex-shrink-0">
                                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                                Lexical Units
                                            </h3>
                                        </div>
                                    </div>
                                    <div class="overflow-x-auto">
                                        <table
                                            class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                                            <thead
                                                class=" text-xs text-gray-700 uppercase  dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="px-6 py-3 rounded-l-lg">
                                                    Lexical Unit
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Type
                                                </th>
                                                <th scope="col" class="px-6 py-3 rounded-r-lg">
                                                    Entry Report
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Annotation Report
                                                </th>
                                                {/*<th scope="col" class="px-6 py-3 rounded-r-lg">*/}

                                                {/*</th>*/}
                                            </tr>
                                            </thead>
                                            <tbody>

                                            <For each={frame()?.mirror?.lexicalUnits ?? []}>{(lex) =>
                                                <tr class="border-b dark:border-gray-700">
                                                    <td class="px-4 py-3">{lex.name}</td>
                                                    <td class="px-4 py-3">{Object.keys(LEXICAL_UNIT_TYPE)[Object.values(LEXICAL_UNIT_TYPE).indexOf(lex.type)]}</td>
                                                    <td class="px-4 py-3"><A target="_blank"
                                                                             class="font-medium text-blue-600 dark:text-blue-500 hover:underline inactive"
                                                                             href={`/lexicalUnit/edit/${lex._id}`}>Entry</A>
                                                    </td>
                                                    <td class="px-4 py-3">
                                                        <Show when={lex.taggedSentenceCount > 0} fallback={
                                                            "-"
                                                        } >
                                                        <A target="_blank"
                                                                             class="font-medium text-blue-600 dark:text-blue-500 hover:underline inactive"
                                                                             href={`/lexicalUnit/annotation/${lex._id}`}>Annotation</A></Show>
                                                    </td>
                                                    {/*<td class="px-4 py-3"><A href=""
                                                                             class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline inactive">Entry</A>
                                                    </td>
                                                    <td class="px-4 py-3"><A href=""
                                                                             class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline inactive">Annotation</A>
                                                    </td>*/}
                                                </tr>
                                            }</For>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Show>
                            <div dir={frame().lang === 2 ? 'ltr' : 'rtl'}
                                 class={`relative md:p-3 overflow-hidden ${frame()?.mirror && ''}  `}>
                                <div
                                    class="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4 p-4">
                                    <div
                                        class="w-full md:w-auto text-center flex flex-col  md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-center md:space-x-3 flex-shrink-0">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                            {frame().lang === 2 ? 'واحدهای واژگانی' : 'Lexical Units'}

                                        </h3>
                                    </div>
                                </div>
                                <div class="overflow-x-auto">
                                    <table dir={frame().lang === 2 ? 'rtl' : 'ltr'}
                                           class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                                        <thead
                                            class=" text-xs text-gray-700 uppercase dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 rounded-l-lg">
                                                {frame().lang === 2 ? 'واحد واژگانی' : 'Lexical Unit'}

                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                {frame().lang === 2 ? 'نوع' : 'Type'}
                                            </th>
                                            <th scope="col" class="px-6 py-3 rounded-r-lg">
                                                {frame().lang === 2 ? 'گزارش مدخل' : 'Entry Report'}

                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                {frame().lang === 2 ? 'گزارش برچسب‌نگاری' : 'Annotation Report'}

                                            </th>
                                            {/*<th scope="col" class="px-6 py-3 rounded-r-lg">*/}

                                            {/*</th>*/}
                                        </tr>
                                        </thead>
                                        <tbody>

                                        <For each={frame()?.lexicalUnits ?? []}>{(lex) =>
                                            <tr class="border-b dark:border-gray-700">
                                                <td class="px-4 py-3">{lex.name}</td>
                                                <td class="px-4 py-3">{Object.keys(LEXICAL_UNIT_TYPE)[Object.values(LEXICAL_UNIT_TYPE).indexOf(lex.type)]}</td>
                                                <td class="px-4 py-3">
                                                    <A target="_blank"
                                                       class="font-medium text-blue-600 dark:text-blue-500 hover:underline inactive"
                                                       href={`/lexicalUnit/edit/${lex._id}`}>     {frame().lang === 2 ? ' مدخل' : 'Entry'}</A>
                                                </td>
                                                <td class="px-4 py-3">
                                                    <Show when={lex.taggedSentenceCount > 0} fallback={
                                                        "-"
                                                    } >
                                                    <A target="_blank"
                                                                         class="font-medium text-blue-600 dark:text-blue-500 hover:underline inactive"
                                                                         href={`/lexicalUnit/annotation/${lex._id}`}> {frame().lang === 2 ? ' برچسب‌نگاری' : 'Annotation'}</A>
                                                    </Show>
                                                </td>
                                                {/*<td class="px-4 py-3"><A href=""*/}
                                                {/*                         class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline inactive">Entry</A>*/}
                                                {/*</td>*/}
                                                {/*<td class="px-4 py-3"><A href=""*/}
                                                {/*                         class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline inactive">Annotation</A>*/}
                                                {/*</td>*/}
                                            </tr>
                                        }</For>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>


                    </div>
                </section>


                <section class="bg-white border border-gray-200 rounded-lg shadow p-1 sm:p-1">
                    <div class="mx-auto max-w-screen-xl px-2 ">

                        <Show when={frame()?.message}>
                            <p class="text-center text-gray-500 dark:text-gray-400">{
                                frame().message ? `پیام : ${frame().message}` : ''

                            }</p>
                            <div class="inline-flex items-center justify-center w-full">
                                <hr class="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
                            </div>
                        </Show>

                        <div class="inline-flex items-center justify-center w-full">
                            <Show
                                when={localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['edit frame'])}>
                                <button onClick={() => changeStatus(FRAME_STATUS['unchanged'])}
                                        class="text-white  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                    بدون تغییر
                                </button>
                            </Show>
                            <Show
                                when={localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['edit frame'])}>
                                <button onClick={() => changeStatus(FRAME_STATUS['editing'])}
                                        class="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                    درحال ویرایش
                                </button>
                            </Show>
                            <Show
                                when={localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['edit frame'])}>
                                <button onClick={() => changeStatus(FRAME_STATUS['waiting'])}
                                        class="text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                    در انتظار بررسی
                                </button>
                            </Show>
                            <Show
                                when={frame().status !== FRAME_STATUS['refused'] && (localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['refuse frame']))}>
                                <button onClick={() => {
                                    setModal(FRAME_STATUS['refused'])
                                }}
                                        class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                    رد
                                </button>
                            </Show>
                            <Show
                                when={frame().status !== FRAME_STATUS['published'] && (localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['publish frame']))}>
                                <button onClick={() => {
                                    setModal(FRAME_STATUS['published'])
                                }}
                                        class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                    تایید
                                </button>
                            </Show>




                        </div>


                        <div class="inline-flex items-center justify-center w-full">
                            <button onClick={() => softDelete(!softDeleted())} class={`${softDeleted() ? 'text-green-500' : 'text-red-600'} hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg inline-flex items-center text-sm px-5 py-2.5 text-center mr-2 mb-2 `}>
                                <Show when={softDeleted()} fallback={
                                    <>
                                        حذف موقف
                                        <svg
                                            class="w-5 h-5"
                                            fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                        </svg>
                                    </>
                                }>
                                    <>
                                        برگردان
                                        <svg
                                            class="w-5 h-5"
                                            fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
                                        </svg>
                                    </>
                                </Show>
                            </button>
                            <button onClick={duplicate}
                                    class="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg inline-flex items-center text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
                                </svg>تکرار
                            </button>

                            <A href={`/frame/edit/${params.frame}`}
                               class="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg inline-flex items-center text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
                                ویرایش قالب معنایی
                                <svg class="w-5 h-5 " fill="none" stroke="currentColor" stroke-width="1.5"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"></path>
                                </svg>
                            </A>
                            <A href={`/element/list/${params.frame}`}
                               class="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg inline-flex items-center text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
                                ویرایش اجزای معنایی
                                <svg class="w-5 h-5 " fill="none" stroke="currentColor" stroke-width="1.5"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"></path>
                                </svg>
                            </A>
                            <A href={`/lexicalUnit/list/${params.frame}`}
                               class="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg inline-flex items-center text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
                                ویرایش واحد واژگانی
                                <svg class="w-5 h-5 " fill="none" stroke="currentColor" stroke-width="1.5"
                                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"></path>
                                </svg>
                            </A>
                        </div>


                    </div>
                </section>


            </Show>
        </>
    );
}
export default Frame;