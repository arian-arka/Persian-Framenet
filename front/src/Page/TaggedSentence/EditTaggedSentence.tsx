import {Component, createEffect, createSignal, For, Match, Show, Switch} from "solid-js";
import {A, useParams} from "@solidjs/router";
import {useLocalData} from "../../Core/LocalData";
import {useToast} from "../../Component/Toast";
import SentenceApi from "../../Api/Sentence.api";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import DropDownInput from "../../Component/Input/DropDownInput";
import FrameApi from "../../Api/Frame.api";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import LexicalUnitApi from "../../Api/LexicalUnit.api";
import SelectInput from "../../Component/Input/SelectInput";
import {LEXICAL_UNIT_TYPE} from "../../Constant/LexicalUnit";
import ElementApi from "../../Api/Element.api";
import {FRAME_NET_TAGE_TYPE, PROP_BANK_TAGE_TYPE, TAGGED_SENTENCE_STATUS} from "../../Constant/TaggedSentence";
import {SentenceInterface} from "../../Type/Sentence.interface";
import FrameInterface from "../../Type/Frame.interface";
import TaggedSentenceApi from "../../Api/TaggedSentence.api";
import {FullTaggedSentenceInterface, TaggedSentenceInterface} from "../../Type/TaggedSentence.interface";
import {data} from "autoprefixer";
import {ElementInterface} from "../../Type/Element.interface";
import {LexicalUnitInterface} from "../../Type/LexicalUnit.interface";
import TextInput from "../../Component/Input/TextInput";
import Language from "../../Core/Language";
import TextareaInput from "../../Component/Input/TextareaInput";
import {FRAME_STATUS} from "../../Constant/Frame";
import {USER_PRIVILEGES} from "../../Constant/User";
import UserInterface from "../../Type/User.interface";
import {ELEMENT_TYPE} from "../../Constant/Element";

function invertColor(color) {
    return '#' + ("000000" + (0xFFFFFF ^ parseInt(color.substring(1), 16)).toString(16)).slice(-6);
}

const EditTaggedSentence: Component = () => {
    const [newLexicalUnit, setNewLexicalUnit] = createSignal<any>({}, {equals: false});
    const setNewLexicalUnitVal = (key: string, val: null | undefined | string) => {
        const _ = newLexicalUnit();
        _[key] = val;
        setNewLexicalUnit(_);
    }
    const [modal, setModal] = createSignal<number>(0);
    const [modalMessage, setModalMessage] = createSignal('');
    const [loadingSideBar, setLoadingSideBar] = createSignal(false);
    const [sidebar, setSidebar] = createSignal(false);
    const [loading, setLoading] = createSignal(false);
    const params = useParams<{ taggedSentence: string }>();
    const localData = useLocalData();
    const toast = useToast();
    const [errors, setErrors] = createSignal<any>({}, {equals: false});
    let n = 1;
    const [words, setWords] = createSignal<string[]>([], {equals: false});
    const [probBankTags, setProbBankTags] = createSignal<(number | null)[]>([], {equals: false});

    const [taggedWords, setTaggedWords] = createSignal<({
        word: string,
        type: number,
        element?: string | undefined | null,
        color?: string | undefined | null,
        selected: boolean,
    })[]>([], {equals: false});

    const [taggedSentence, setTaggedSentence] = createSignal<FullTaggedSentenceInterface | undefined>(undefined, {equals: false});
    const [sentence, setSentence] = createSignal<SentenceInterface | undefined>(undefined, {equals: false});

    const [frames, setFrames] = createSignal<any>([], {equals: false});

    const [frame, setFrame] = createSignal<any>(undefined, {equals: false});

    const [lexicalUnits, setLexicalUnits] = createSignal<any>(undefined, {equals: false});

    const [lexicalUnit, setLexicalUnit] = createSignal<any>(undefined, {equals: false});

    const [elements, setElements] = createSignal<any>(undefined, {equals: false});
    const [selectedShift, setSelectedShift] = createSignal(false);
    window.addEventListener('keyup', (e) => setSelectedShift(false));
    window.addEventListener('keydown', (e) => setSelectedShift(e.shiftKey));

    const selectTaggedWord = (index: number, status: boolean) => {
        const _ = taggedWords();
        if (status) {
            let lastSelected = undefined;

            for (let i = 0; i < _.length; i++) {
                if (_[i].selected) {
                    if (lastSelected === undefined)
                        lastSelected = i;
                    else {
                        lastSelected = undefined;
                        break;
                    }
                }
            }

            if (lastSelected !== undefined && selectedShift()) {
                const upperBond = index > lastSelected ? index : lastSelected;
                const lowerBond = index > lastSelected ? lastSelected : index;
                for (let i = 0; i < _.length; i++)
                    _[i].selected = i <= upperBond && i >= lowerBond;
                setTaggedWords([..._]);
                return;
            }
        }
        _[index].selected = status;
        setTaggedWords([..._]);
    }
    const unSelectAllTaggedWords = () => {
        const _ = taggedWords();
        for (let i = 0; i < _.length; i++)
            _[i].selected = false;
        setTaggedWords([..._]);
    }

    const assignElementToSelectedWord = (element) => {
        const _ = taggedWords();
        for (let w of _) {
            if (w.selected) {
                if (w.type !== FRAME_NET_TAGE_TYPE['lexicalUnit'])
                    w.type = FRAME_NET_TAGE_TYPE['element'];
                w.element = element._id;
                w.color = element.color;
                w.selected = false;
            }
        }
        setTaggedWords([..._]);
    }
    const assignLexicalUnitToSelectedWord = () => {
        const _ = taggedWords();
        for (let w of _) {
            if (w.selected) {
                if (w.type === FRAME_NET_TAGE_TYPE['lexicalUnit'])
                    w.type = !!w.element ? FRAME_NET_TAGE_TYPE['element'] : FRAME_NET_TAGE_TYPE['empty'];
                else
                    w.type = FRAME_NET_TAGE_TYPE['lexicalUnit'];
                w.selected = false;
            }
        }
        setTaggedWords([..._]);
    }
    const assignSupportToSelectedWord = () => {
        const _ = taggedWords();
        for (let w of _) {
            if (w.selected) {
                w.type = FRAME_NET_TAGE_TYPE['support'];
                w.element = undefined;
                w.color = undefined;
                w.selected = false;
            }
        }
        setTaggedWords([..._]);
    }
    const assignEmptyToSelectedWord = () => {
        const _ = taggedWords();
        for (let w of _) {
            if (w.selected) {
                w.type = FRAME_NET_TAGE_TYPE['empty'];
                w.element = undefined;
                w.color = undefined;
                w.selected = false;
            }
        }
        setTaggedWords([..._]);
    }

    function wordsToButtons(_taggedWords: ({
        word: string,
        type: number,
        element?: string,
        color?: string,
        selected: boolean,
    })[] | undefined | []) {
        const getPropBank = (prop) => {
            if (prop || prop === '0' || prop === 0)
                return Object.keys(PROP_BANK_TAGE_TYPE)[Object.values(PROP_BANK_TAGE_TYPE).indexOf(parseInt(prop))]
            return '';
        }
        console.log(_taggedWords);
        return (
            <For each={_taggedWords ?? []}>{(w, index) =>

                <Switch>
                    <Match when={w.type === FRAME_NET_TAGE_TYPE['empty']}>
                        <button type="button" onClick={(e) => {
                            selectTaggedWord(index(), !w.selected)
                        }}
                                class={w.selected ? 'border-4 border-dashed border-gray-900  bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                            <span class="w-full">
                                {w.word}
                                <br/>
                                {getPropBank(taggedSentence()?.propBankTags[index()])}
                            </span>


                        </button>
                    </Match>
                    <Match when={w.type === FRAME_NET_TAGE_TYPE['support']}>
                        <button type="button" onClick={(e) => {
                            selectTaggedWord(index(), !w.selected)
                        }}
                                class={w.selected ? 'border-4 border-dashed border-gray-900  inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-whiteinline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                            <span class="w-full">
                                {w.word} (واحد حمایتی)
                          <br/>
                                {getPropBank(taggedSentence()?.propBankTags[index()])}
                            </span>

                        </button>
                    </Match>
                    <Match when={w.type === FRAME_NET_TAGE_TYPE['lexicalUnit']}>
                        <Show when={!!w.element} fallback={
                            <button type="button" onClick={(e) => {
                                selectTaggedWord(index(), !w.selected)
                            }}
                                    class={w.selected ? 'border-4 border-dashed border-gray-900 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                                <span class="w-full">{w.word}<span
                                    class="font-bold text-gray-900"> (واحد واژگانی)</span>

                                       <br/>
                                    {getPropBank(taggedSentence()?.propBankTags[index()])}
                                </span>

                            </button>
                        }>
                            <button type="button" onClick={(e) => {
                                selectTaggedWord(index(), !w.selected)
                            }}
                                    class={w.selected ? 'border-4 border-dashed border-gray-900 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                                <span class="w-full">
                                    <span style={`background-color:${w.color} !important;color:white!important`}>
                                    {w.word}<span class="font-bold text-gray-900"> (واحد واژگانی)</span>
                                       </span>
                                    <br/>
                                    {getPropBank(taggedSentence()?.propBankTags[index()])}
                                </span>

                            </button>
                        </Show>

                    </Match>
                    <Match when={w.type === FRAME_NET_TAGE_TYPE['element']}>
                        <button type="button" onClick={(e) => {
                            selectTaggedWord(index(), !w.selected)
                        }}
                                class={w.selected ? 'border-4 border-dashed border-gray-900 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-white inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                            <span class="w-full">
                                <span
                                    style={`background-color:${w.color} !important;color:white!important`}>{w.word}</span>
                                <br/>
                                {getPropBank(taggedSentence()?.propBankTags[index()])}
                            </span>

                        </button>
                    </Match>
                </Switch>

                // <button type="button"
                //         onClick={(e) => {
                //             selectTaggedWord(index(),!w.selected)
                //         }}
                //         class={w.selected ? 'bg-gray-400 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1' : 'bg-gray-50 inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg  m-1'}>
                //     <Show when={w.color} fallback={
                //         <span class="w-full">{w.word}</span>
                //     } >
                //         <span class="w-full" style={`color:${w.color} !important`}>{w.word}</span>
                //
                //     </Show>
                //
                // </button>


            }</For>
        );
    }

    const findFrames = async (name: string | undefined) => {
        if (!name || name.length === 0) {
            setFrames(undefined);
            return;
        }
        try {
            const ok = await (new FrameApi()).withoutWaiting(name, 2).fetch();
            setFrames(ok.data.data);
        } catch (e) {
            setFrames(undefined);
            if (isUnauthenticated(e))
                localData.navigate('/login')
            setFrames(undefined);
        }
    }
    const findLexicalUnits = async () => {
        if (!frame()) {
            setLexicalUnits(undefined);
            return;
        }
        try {
            const ok = await (new LexicalUnitApi()).forTagging(frame()._id).fetch();
            setLexicalUnits(ok.data);
        } catch (e) {
            setLexicalUnits(undefined);
            if (isUnauthenticated(e))
                localData.navigate('/login')
        }
    }
    const findElements = async () => {
        if (!frame()) {
            setElements(undefined);
            return;
        }
        try {
            const ok = await (new ElementApi()).list(frame()._id).fetch();
            setElements(ok.data);

        } catch (e) {
            setElements(undefined);
            if (isUnauthenticated(e))
                localData.navigate('/login')
        }
    }

    const [lexicalUnitHint, setLexicalUnitHint] = createSignal<null | string>(null);
    const [description, setDescription] = createSignal<null | string>(null);
    (new TaggedSentenceApi()).show(params.taggedSentence).forever({
        ok(r: Ok<FullTaggedSentenceInterface>) {
            Log.success('r', r);
            setLexicalUnitHint(!!r.data.lexicalUnitHint ? r.data.lexicalUnitHint : null);
            setDescription(!!r.data.description ? r.data.description : null);
            if (r.data.frameNetTags.length === 0) {
                r.data.frameNetTags = r.data.words.split(' ').map((w) => {
                    return {
                        'tagType': 0,
                        'element': null
                    }
                })
            }
            setLexicalUnit(!!r.data.lexicalUnit ? r.data.lexicalUnit._id : '');
            setStatusSignal(r.data.status);
            setTaggedSentence(r.data);
            setFrame(r.data.frame);
            findLexicalUnits();
            findElements();
            setSentence(r.data.sentence as SentenceInterface);
            setWords(sentence()?.words.split(' ') ?? []);
            const selectAbleWords = [];
            for (let index in r.data.frameNetTags) {
                const w = r.data.frameNetTags[index];
                selectAbleWords.push({
                    word: words()[index],
                    type: w.tagType,
                    element: w.element ? (w.element as ElementInterface)._id : null,
                    color: w.element ? (w.element as ElementInterface).color : null,
                    selected: false,
                })
            }
            setProbBankTags(r.data.propBankTags);
            setTaggedWords(selectAbleWords);
        },
        unAuthenticated(r: BadRequest) {
            localData.navigate('/login');
        },
    });

    const editTaggedSentence = async () => {
        setLoading(true);
        try {
            const d = {
                'lexicalUnitHint': lexicalUnitHint(),
                'description': description(),
                propBankTags: taggedSentence()?.propBankTags?.map((el) => parseInt(el)) ?? [],
                frame: frame()?._id ?? null,
                lexicalUnit: !!lexicalUnit() ? lexicalUnit() : null,
                frameNetTags: taggedWords().map((tmp) => {
                    const _tmp: any = {tagType: tmp.type};
                    if (tmp.element)
                        _tmp['element'] = tmp.element;
                    return _tmp;
                })
            };
            console.log(d);
            const ok = await (new TaggedSentenceApi()).edit(params.taggedSentence, d).fetch();

            setTaggedSentence(ok.data);
            console.log('edit', taggedSentence());
            toast.success('با موفقیت ذخیره شد');
        } catch (e) {
            console.log('e', e)
            if (isBadRequest(e)) {
                toast.firstError(e);
                setErrors((e as BadRequest).data.errors);
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

    const fetchStoreLexicalUnit = async () => {
        if (!frame()) {
            toast.warning('لطفا ابتدا قاب معنایی انتخاب کنید')
            return;
        }
        setLoadingSideBar(true);
        try {
            const ok = await (new LexicalUnitApi()).storeForTaggedSentence(frame()._id, newLexicalUnit()).fetch()
            toast.success(`با موفقیت ساخته شد.`);
            await findLexicalUnits();
            setSidebar(false);
            setNewLexicalUnit({
                type: '',
                name: '',
                definition: '',
            });
        } catch (e) {
            console.log(e);
            if (isBadRequest(e)) {
                const _errors = Object.values((e as BadRequest).data?.errors ?? {});
                // @ts-ignore
                toast.danger(_errors.length === 0 ? (e as BadRequest).data.message : _errors[0])
            } else if (isUnauthenticated(e))
                localData.navigate('/login');
            else if (isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        } finally {
            setLoadingSideBar(false);
        }
    }

    const changeTaggedSentenceStatus = (message: string, status: number) => {
        const _ = taggedSentence();
        if (_) {
            _['status'] = status;
            _['message'] = message;
        }
        setTaggedSentence(_);
    }
    const changeStatus = async (status: number) => {
        setLoading(true);
        try {
            const ok = await (new TaggedSentenceApi()).status(params.taggedSentence, status).fetch();
            changeTaggedSentenceStatus('', status);
            toast.success('با موفقیت اعمال شد');

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
    const publishTaggedSentence = async (message: string, status: number) => {
        setLoading(true);
        try {
            const ok = await (new TaggedSentenceApi()).publish(params.taggedSentence,
                {status, 'message': message.length === 0 ? undefined : message}
            ).fetch();
            changeTaggedSentenceStatus(message, status);
            toast.success('با موفقیت اعمال شد');
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
    document.title = 'برچسب نگاری';
    const [statusSignal, setStatusSignal] = createSignal<any>(undefined);
    const showStatus = (status) => {
        return <Switch>
            <Match when={TAGGED_SENTENCE_STATUS['published'] === status}>
                <span class="text-green-500">نهایی</span>
            </Match>
            <Match when={TAGGED_SENTENCE_STATUS['refused'] === status}>
                <span class="text-red-600">رد</span>
            </Match>
            <Match when={TAGGED_SENTENCE_STATUS['editing'] === status}>
                <span class="text-yellow-300">در حال ویرایش</span>
            </Match>
            <Match when={TAGGED_SENTENCE_STATUS['waiting'] === status}>
                <span class="text-orange-500">در انتظار بررسی</span>
            </Match>
            <Match when={TAGGED_SENTENCE_STATUS['unchanged'] === status}>
                <span class="text-gray-500">بدون تغییر</span>
            </Match>
        </Switch>
    }

    createEffect(() => {
        setStatusSignal(taggedSentence()?.status ?? undefined);
    });

    const onDelete = async () => {
        setLoading(true);
        try {
            const ok = await (new TaggedSentenceApi()).delete(params.taggedSentence).fetch();
            localData.navigate(`/taggedSentence/list`)
            toast.success('با موففقیت پاک شد.');
        } catch (e) {
            console.log(e);
            if (isBadRequest(e)) {
                toast.firstError(e);
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
    const [showDelete, setShowDelete] = createSignal(false);

    return (<>

        <div style="right:40%"
             class={`${showDelete() ? '' : 'hidden'} fixed top-1/3 z-50  p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full `}>
            <div class=" w-full ">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" onClick={() => setShowDelete(false)}
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
                        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">آیا از انجام این کار
                            اطمینان دارید؟</h3>

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

        <Show when={taggedSentence()} fallback={
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
                                TAGGED_SENTENCE_STATUS['published'] === modal() ? 'تایید' : 'رد'
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
                                    const status = modal() === TAGGED_SENTENCE_STATUS['published'] ? TAGGED_SENTENCE_STATUS['published'] : TAGGED_SENTENCE_STATUS['refused'];
                                    setModal(0);
                                    await publishTaggedSentence(msg, status);
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

            <div
                class="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mt-2">

                <section class="bg-white border border-gray-200 rounded-lg shadow p-1 sm:p-1">
                    <div class="mx-auto max-w-screen-xl px-2 ">

                        <p class="text-center text-gray-500 dark:text-gray-400">{showStatus(statusSignal())}</p>
                        <div class="inline-flex items-center justify-center w-full">
                            <hr class="w-64 h-px my-1 bg-gray-200 border-0 dark:bg-gray-700"/>
                        </div>

                        <p class="text-center text-gray-500 dark:text-gray-400">
                            <Show
                                when={taggedSentence()?.issuer && taggedSentence()?.status != TAGGED_SENTENCE_STATUS['unchanged']}>
                                {
                                    (taggedSentence()?.issuer as UserInterface).name ? ` کاربر : ${(taggedSentence()?.issuer as UserInterface).name} ` : ' '
                                }
                            </Show>

                        </p>
                        <p class="text-center text-gray-500 dark:text-gray-400">
                            <Show
                                when={taggedSentence()?.reviewer && (taggedSentence()?.status == TAGGED_SENTENCE_STATUS['refused'] || taggedSentence()?.status == TAGGED_SENTENCE_STATUS['published'])}>
                                {
                                    ((taggedSentence()?.reviewer as UserInterface).name ? ` بررسی‌کننده : ${(taggedSentence()?.reviewer as UserInterface).name} ` : ' ')
                                }
                            </Show>
                        </p>
                        <Show when={taggedSentence()?.message}>
                            <p class="text-center text-gray-500 dark:text-gray-400">{
                                taggedSentence()?.message ? `پیام : ${taggedSentence()?.message}` : ''

                            }</p>
                            <div class="inline-flex items-center justify-center w-full">
                                <hr class="w-64 h-px my-1 bg-gray-200 border-0 dark:bg-gray-700"/>
                            </div>
                        </Show>


                    </div>
                </section>

                <div class={`grid grid-cols-1 `}>
                    <div class="inline-flex items-center justify-center w-full mt-2">
                        <Show
                            when={localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['edit tagged sentence'])}>
                            <button onClick={() => changeStatus(FRAME_STATUS['unchanged'])}
                                    class="text-primary-600 text-primary-600 border border-primary-600 bg-white shadow-lg shadow-primary-250/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                بدون تغییر
                            </button>
                        </Show>
                        <Show
                            when={localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['edit tagged sentence'])}>
                            <button onClick={() => changeStatus(FRAME_STATUS['editing'])}
                                    class="text-yellow-400 text-yellow-400 border border-yellow-400 bg-white shadow-lg shadow-yellow-250/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                درحال ویرایش
                            </button>
                        </Show>
                        <Show
                            when={localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['edit tagged sentence'])}>
                            <button onClick={() => changeStatus(FRAME_STATUS['waiting'])}
                                    class="text-orange-400 text-orange-400 border border-orange-400 bg-white shadow-lg shadow-orange-250/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                در انتظار بررسی
                            </button>
                        </Show>

                        <Show
                            when={taggedSentence()?.status !== FRAME_STATUS['refused'] && (localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['refuse tagged sentence']))}>
                            <button onClick={() => {
                                setModal(FRAME_STATUS['refused'])
                            }}

                                    class="text-red-600 text-red-600 border border-red-600 bg-white shadow-lg shadow-red-250/50 rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                رد
                            </button>
                        </Show>
                        <Show
                            when={taggedSentence()?.status !== FRAME_STATUS['published'] && (localData.localData()?.isSuperAdmin === 'true' || localData.localData()?.privileges.includes(USER_PRIVILEGES['publish tagged sentence']))}>
                            <button onClick={() => {
                                setModal(FRAME_STATUS['published'])
                            }}
                                    class="text-green-600 text-green-600 border border-green-600 bg-white shadow-lg shadow-green-250/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                تایید
                            </button>
                        </Show>
                    </div>
                </div>

            </div>
            <Show when={sidebar() && frame()}>
                <div
                    // class="fixed top-0 left-0 z-20 w-full h-screen max-w-xs p-4 transition-transform -translate-x-full bg-white dark:bg-gray-800"
                    class="fixed top-0 left-0 z-40 w-full h-screen max-w-xs p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 transform-none"
                    tabIndex="-1" aria-labelledby="drawer-label" aria-hidden="true">
                    <h5 id="drawer-label"
                        class="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">ساخت
                        واحد واژگانی</h5>
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
                        <TextInput
                            label={`عنوان`}
                            type={'text'}
                            placeholder='نام   واحد واژگانی...'
                            value={newLexicalUnit()?.name}
                            onInput={(val) => setNewLexicalUnitVal('name', val)}

                        />
                        <SelectInput
                            label={`نوع`}
                            value={newLexicalUnit()?.type}
                            options={[
                                {
                                    text: 'انتخاب',
                                    value: ''
                                },
                                ...Object.keys(LEXICAL_UNIT_TYPE).map((text) => {
                                    return {
                                        'text': text,
                                        // @ts-ignore
                                        'value': `${LEXICAL_UNIT_TYPE[text]}`,
                                    }
                                })
                            ]}
                            onInput={(val) => setNewLexicalUnitVal('type', val)}
                        />
                        <TextareaInput
                            label={`تعریف`}
                            placeholder='تعریف واحد واژگانی...'
                            value={newLexicalUnit()?.definition}
                            onInput={(val) => setNewLexicalUnitVal('definition', val)}
                        />
                        <div
                            class="gap-2 bottom-0 left-0 flex justify-center w-full pb-4 space-x-4 md:px-4 md:absolute">
                            <Show when={!loadingSideBar()} fallback={
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


                                <button onClick={fetchStoreLexicalUnit}
                                        class="text-white w-full justify-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    ذخیره
                                </button>

                            </Show>

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
            <Show when={!!taggedSentence()?.frameHelper || !!taggedSentence()?.lexicalUnitHelper}>
                <section
                    class="bg-white text-center border border-gray-200 rounded-lg shadow sm:flex sm:items-center sm:justify-between p-1 sm:p-1 xl:p-1  dark:bg-gray-800 dark:border-gray-700 mt-1">
                    <div class="grid grid-cols-2 ">
                        <Show when={!!taggedSentence()?.frameHelper}>
                            <p class="mb-4 text-medium  text-gray-900 dark:text-gray-400 sm:mb-0">
                                قالب معنایی ماشینی:

                                <span class="font-bold">{` ${taggedSentence()?.frameHelper} `}</span>
                            </p>
                        </Show>
                        <Show when={!!taggedSentence()?.lexicalUnitHelper}>
                            <p class="mb-4 text-medium  text-gray-900 dark:text-gray-400 sm:mb-0">
                                واحد واژگانی ماشینی:

                                <span class="font-bold">{` ${taggedSentence()?.lexicalUnitHelper} `}</span>
                            </p>
                        </Show>
                    </div>
                </section>
            </Show>

            {/*

            <section
                class="bg-white border border-gray-200 rounded-lg shadow sm:flex sm:items-center sm:justify-between p-1 sm:p-1 xl:p-1  dark:bg-gray-800 dark:border-gray-700 mt-1">
                <p class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                    <Show when={!!taggedSentence()?.frameHelper} >
                        <span class="font-bold">قالب معنایی ماشینی: </span>
                        {taggedSentence()?.frameHelper}
                    </Show>
                    <Show when={!!taggedSentence()?.lexicalUnitHelper} >
                        <span class="font-bold">واحد واژگانی ماشینی: </span>
                        {taggedSentence()?.lexicalUnitHelper}
                    </Show>
                </p>
            </section>
*/}


            <section
                class="bg-white border border-gray-200 rounded-lg shadow sm:flex sm:items-center sm:justify-between p-1 sm:p-1 xl:p-1  dark:bg-gray-800 dark:border-gray-700 mt-1">
                <p dir={taggedSentence()?.lang === 1 ? 'ltr' : 'rtl'}
                   class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                    <Show when={taggedSentence()}>
                        <A target="_blank" href={`/helper/translate-with-frame?sentence=${taggedSentence().words}`}
                           class="inline-block ml-2 font-medium text-blue-600  hover:underline">
                            <svg class="flex-shrink-0w-5 h-5 text-blue-600 dark:text-white" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6-3.976-2-.01A4.015 4.015 0 0 1 3 7m10 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
                            </svg>
                        </A>
                    </Show>
                    <Show when={taggedSentence() && taggedSentence().frameNetTags.length > 0}>
                        <For each={taggedSentence().words.split(' ')}>{(w, index) =>
                            <Switch>
                                <Match
                                    when={taggedSentence().frameNetTags[index()].tagType === FRAME_NET_TAGE_TYPE['empty']}>
                                    <span class="inline">{w + ' '}</span>
                                </Match>
                                <Match
                                    when={taggedSentence().frameNetTags[index()].tagType === FRAME_NET_TAGE_TYPE['support']}>
                                    <span class="inline underline">{w + ' '}</span>
                                </Match>
                                <Match
                                    when={!taggedSentence().frameNetTags[index()].element && taggedSentence().frameNetTags[index()].tagType === FRAME_NET_TAGE_TYPE['lexicalUnit']}>
                                                <span class="inline"
                                                      style="background-color : black !important; color : white !important;">{w + ' '}</span>
                                </Match>
                                <Match
                                    when={taggedSentence().frameNetTags[index()].element || taggedSentence().frameNetTags[index()].tagType === FRAME_NET_TAGE_TYPE['element']}>
                                                <span class="inline"
                                                      style={`background-color:${taggedSentence().frameNetTags[index()]['element']['color']} !important; color : white!important;`}>{w + ' '}</span>
                                </Match>
                            </Switch>
                        }</For>
                    </Show>
                </p>
            </section>


            <section
                class="bg-white border border-gray-200 rounded-lg shadow sm:flex sm:items-center sm:justify-between p-1 sm:p-1 xl:p-1  dark:bg-gray-800 dark:border-gray-700 mt-1">
                <div dir={taggedSentence()?.lang === 1 ? 'ltr' : 'rtl'} class="w-full inline-block">
                    <div class="w-1/4 inline-block px-2">
                        <p class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                            واحد واژگانی پیشنهادی
                        </p>
                        <TextareaInput rows={1}
                                       disabled={localData.localData()?.isSuperAdmin !== 'true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['store tagged sentence'])}
                                       value={lexicalUnitHint()}
                                       onInput={(val: any) => setLexicalUnitHint(val)}
                                       error={''}

                        />
                    </div>
                    <div class="w-3/4 inline-block px-2">
                        <p class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                            توضیحات
                        </p>
                        <TextareaInput rows={1}
                                       value={description()}
                                       onInput={(val: any) => setDescription(val)}
                                       error={''}
                        />
                    </div>
                </div>

            </section>
            <div
                class="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mt-2">
                <div class={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 sm:gap-6`}>
                    <div class="w-full">
                        <DropDownInput
                            unique={true}
                            allowMultiple={false}
                            options={frames()}
                            label={'قالب معنایی'}
                            placeholder={'جستجوی قالب معنایی ...'}
                            customText={(val: FrameInterface) => val.name}
                            customComparator={(val: FrameInterface, current: any) => val._id === current}
                            selected={taggedSentence()?.frame ?? ''}
                            passThrough={(val) => {
                                if (val.lang == 1 && val.mirror)
                                    return val.mirror;
                                return val;
                            }}
                            onAlt={(e,setText) => {
                                const before = localData.get('taggedSentenceFrameSearch');
                                if(!!before){
                                    e.target.value = before;
                                    setText(before);
                                }
                            }}
                            onSelected={async (val: any) => {
                                setFrame(val);
                                localData.set('taggedSentenceFrameSearch',val.name);
                                await findLexicalUnits();
                                await findElements();
                            }}
                            onInput={(name: string | undefined) => {
                                setTimeout(() => findFrames(name),200);
                            }}س
                            error={''}
                        />
                    </div>
                    <div class="w-full">
                        <SelectInput
                            label={
                                <>
                                    واحد واژگانی
                                    <button onClick={() => {
                                        if (!frame()) {
                                            toast.warning('لطفا ابتدا قالب معنایی انتخاب کنید');
                                        } else
                                            setSidebar(true);
                                    }}
                                            class=" mr-2 text-white  bg-blue-700 border border-blue-700 hover:bg    -white hover:text-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-0.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                        <svg class="w-2 h-2" fill="none" stroke="currentColor" stroke-width="1.5"
                                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                             aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="M12 4.5v15m7.5-7.5h-15"></path>
                                        </svg>
                                    </button>
                                </>
                            }
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={taggedSentence()?.lexicalUnit ? (taggedSentence()?.lexicalUnit as LexicalUnitInterface)._id : ''}
                            onInput={(val: any) => setLexicalUnit(val)}
                            error={''}
                            options={lexicalUnits() ?
                                [
                                    {
                                        text: 'انتخاب واحد واژگانی',
                                        value: '',
                                    },
                                    ...lexicalUnits().map((unit: any) => {
                                        return {
                                            value: `${unit._id}`,
                                            text: `${unit.name}.${unit?.mirror ? `  ${unit.mirror.name} | ` : ''}  ${Object.keys(LEXICAL_UNIT_TYPE)[Object.values(LEXICAL_UNIT_TYPE).indexOf(unit.type)]}`
                                        }
                                    })
                                ]
                                : [
                                    {
                                        text: 'انتخاب واحد واژگانی',
                                        value: '',
                                    }
                                ]
                            }
                        />
                    </div>

                </div>
                <div class="w-full">
                    <div>
                        <Show when={!loading()} fallback={
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
                        }>

                            <button data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="button"
                                    onClick={() => setShowDelete(true)}
                                    class="m-1 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-600 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800">
                                حذف
                            </button>
                            <button onClick={editTaggedSentence}
                                    class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                ذخیره
                            </button>
                        </Show>
                    </div>
                </div>
            </div>

            <section
                class="bg-white border border-gray-200 rounded-lg shadow p-1 sm:p-1 xl:p-1  mt-1">
                <p class="font-bold mb-5 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                    برچسب‌نگاری
                </p>
                <div
                    class="sm:flex sm:items-center sm:justify-between p-1 sm:p-1 xl:p-1 mt-1">
                    <p dir={taggedSentence()?.lang === 1 ? 'ltr' : 'rtl'}
                       class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                        {wordsToButtons(taggedWords())}
                    </p>
                </div>
            </section>


            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <div
                class="  fixed  bottom-2 z-30  text-center bg-white border border-gray-400 rounded-xl shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div class={`grid grid-cols-1    `}>
                    <div class="">
                        <button onClick={assignLexicalUnitToSelectedWord}
                                class="text-gray-900 border border-gray-900 bg-white shadow-lg shadow-gray-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            واحد واژگانی
                        </button>
                        <button onClick={assignSupportToSelectedWord}
                                class="text-gray-900 border border-gray-900 shadow-lg shadow-gray-500/50 bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            واحد حمایتی
                        </button>
                        <button onClick={assignEmptyToSelectedWord}
                                class="text-red-600 border border-red-600 bg-white shadow-lg shadow-red-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            پاک کردن
                        </button>
                        <button onClick={unSelectAllTaggedWords}
                                class="text-orange-500 border border-orange-500 bg-white shadow-lg shadow-orange-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            برداشتن انتخاب‌ها
                        </button>
                    </div>
                    <div class="">
                        <For each={elements() ?? []}>{(el, index) =>
                            // <button style={`border-width:medium; border-radius: 0.5rem ;border-style: solid; border-color:${el.color} !important; background-color:${invertColor(el.color)} !important;`} class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium  ">

                            <button
                                style={`background-color:${el.color}!important;border-color:${el.color}!important;`}
                                onClick={() => {
                                    assignElementToSelectedWord(el)
                                }}
                                class={`text-white relative inline-flex items-center justify-center p-0.5 mr-0.5 mb-0.5 ml-${index() + 2 <= elements().length && elements()[index()].type !== elements()[index() + 1].type && !(elements()[index() + 1].type > 5 && elements()[index()].type > 5) ? 3 : 0.5} overflow-hidden text-sm font-sm  rounded-lg shadow-lg shadow-gray-500/50`}>
                                <span class="relative px-2 py-1 ">{el.name}</span>
                            </button>
                        }</For>
                    </div>
                </div>
            </div>


        </Show>

    </>)
}

export default EditTaggedSentence;
