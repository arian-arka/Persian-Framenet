import {Component, createEffect, createResource, createSignal, Show} from "solid-js";
import Form from "../../Component/Form";
import {FRAME_LANGUAGES} from "../../Constant/Frame";
import Log from "../../Core/Log";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import {useLocalData} from "../../Core/LocalData";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {useToast} from "../../Component/Toast";
import {A, useParams} from "@solidjs/router";
import {Ok} from "../../Core/Api/Response/Ok";
import FrameInterface from "../../Type/Frame.interface";
import FrameApi from "../../Api/Frame.api";
import ElementApi from "../../Api/Element.api";

const EditFrame: Component = () => {
    const params = useParams<{ frame: string }>();
    const localData = useLocalData();
    const toast = useToast();

    const [frame, setFrame] = createSignal<FrameInterface | undefined>(undefined, {equals: false});

    const [errors, setErrors] = createSignal<any>({}, {equals: false});

    const [mirrors, setMirrors] = createSignal<any>(undefined, {equals: false});
    const findMirrors = async (name: string | undefined) => {
        if (!name || name.length === 0) {
            setMirrors(undefined);
            return;
        }
        try {
            const ok = await (new FrameApi()).searchMirror(name).fetch();
            setMirrors(ok.data.data);
        } catch (e) {
            setMirrors(undefined);
            if (isUnauthenticated(e))
                localData.navigate('/login')
            setMirrors(undefined);
        }
    }
    const editFrame = async (values: any, setLoading: Function) => {
        console.log(values);
        setLoading(true);
        try {
            console.log('values',values);
            const ok = await (new FrameApi()).edit(params.frame,{
                name: values.name,
                lang: values.lang,
                definition: values.definition,
                semanticType : !values.semanticType || values.semanticType==='' ? null : values.semanticType,
                mirror : values.mirror && values.mirror !=='' ? values.mirror._id : null ,
            }).fetch();
            setErrors({});
            toast.success('با موفقیت ذخیره شد');
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

    const deleteFrame = async ( setLoading: Function) => {
        setLoading(true);
        try {
            const ok = await (new FrameApi()).delete(params.frame).fetch();
            localData.navigate(`/frame/list`)
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

    (new FrameApi()).full(params.frame).forever({
        ok(r: Ok<FrameInterface>) {
            Log.success('r',r);
            setFrame(r.data)
        },
        unAuthenticated(r: BadRequest) {
            localData.navigate('/login');
        },
    });
    createEffect(() => {
        document.title = frame().name ?? 'قالب معنایی';
    });

    return (
        <>
            <Show when={frame()} fallback={
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
                <Form
                    errors={errors()}
                    header={
                        <div class="mx-auto max-w-screen-xl mb-2">
                            <h2 class="mb-4 text-3xl leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">ویرایش
                                قالب معنایی</h2>
                            <p class="mb-8 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
                                <A href={`/frame/${params.frame}`}
                                   class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                    قالب معنایی
                                    <svg aria-hidden="true" class="w-5 h-5 ml-1" fill="currentColor"
                                         viewBox="0 0 20 20"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                              clip-rule="evenodd"></path>
                                    </svg>
                                </A>
                            </p>
                        </div>
                    }
                    onInput={(key, val) => {
                    }}
                    onSubmit={editFrame}
                    onDelete={deleteFrame}
                    inputs={[
                        [
                            {
                                'type': 'text',
                                'name': 'name',
                                'label': 'نام',
                                'placeholder': 'نام قالب معنایی...',
                                'value': frame()?.name ?? '',
                            },
                            {
                                'type': 'select',
                                'name': 'lang',
                                'label': 'زبان',
                                'value': `${frame()?.lang ?? ''}`,
                                'options': Object.keys(FRAME_LANGUAGES).map((text) => {
                                    return {
                                        'text': text,
                                        // @ts-ignore
                                        'value': `${FRAME_LANGUAGES[text]}`,
                                    }
                                })
                            },
                        ],
                        [
                            {
                                'type': 'dropdown',
                                'name': 'mirror',
                                'label': 'قالب معنایی متناظر',
                                'value': frame()?.mirror,
                                'selected': frame()?.mirror,
                                'options': mirrors,
                                'placeholder': 'جستجو قالب معنایی...',
                                'customText': (val: FrameInterface) => {
                                    return val.name;
                                },
                                'customComparator': (val, current) => {
                                    return val._id === current;
                                },
                                'onInput': (name: string | undefined) => findMirrors(name)
                            },
                            {
                                'type': 'text',
                                'name': 'semanticType',
                                'label': 'گونه معنایی',
                                'placeholder': 'Semantic type...',
                                'value': frame()?.semanticType ?? '',
                            },

                        ],
                        [
                            {
                                'type': 'textarea',
                                'name': 'definition',
                                'label': 'تعریف',
                                'placeholder': 'تعریف قالب معنایی...',
                                'value': frame()?.definition ?? '',
                            },
                        ]
                    ]}
                />
            </Show>
        </>
    );
}
export default EditFrame;