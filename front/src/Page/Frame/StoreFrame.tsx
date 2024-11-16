import {Component, createSignal} from "solid-js";
import Form from "../../Component/Form";
import {FRAME_LANGUAGES} from "../../Constant/Frame";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import {useLocalData} from "../../Core/LocalData";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {useToast} from "../../Component/Toast";
import FrameApi from "../../Api/Frame.api";
import FrameInterface from "../../Type/Frame.interface";

const StoreFrame: Component = () => {
    const localData = useLocalData();
    const toast=useToast();
    const [errors,setErrors] = createSignal<any>({},{equals:false});
    document.title = 'ساخت قالب معنایی';

    const [mirrors, setMirrors] = createSignal<any>(undefined, {equals: false});
    const findMirrors = async (name: string | undefined) => {
        if (!name || name.length === 0) {
            setMirrors(undefined);
            return;
        }
        try {
            const ok = await (new FrameApi()).searchMirror(name).fetch();
            console.log(ok.data);
            setMirrors(ok.data.data);
        } catch (e) {
            setMirrors(undefined);
            if (isUnauthenticated(e))
                localData.navigate('/login')
            setMirrors(undefined);
        }
    }
    const storeFrame = async (values:any, setLoading:Function) => {
        setLoading(true);
        try{
            console.log('values',values);
            const ok = await (new FrameApi()).store({
                name : values.name,
                lang : values.lang,
                definition : values.definition,
                semanticType : !values.semanticType || values.semanticType==='' ? null : values.semanticType,
                mirror : values.mirror && values.mirror !=='' ? values.mirror._id : null ,
            } ).fetch();
            localData.navigate(`/frame/edit/${ok.data._id}`);
            toast.success('با موفقیت ذخیره شد');
        }catch (e) {
            console.log('e',e)
            if(isBadRequest(e)){
                setErrors((e as BadRequest).data.errors);
            }else if(isUnauthenticated(e))
                localData.navigate('/login');
            else if(isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        }finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Form
                errors={errors()}
                header={
                    <div class="mx-auto max-w-screen-xl mb-2">
                        <h2 class="mb-4 text-3xl leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">ساخت
                            قالب معنایی</h2>
                    </div>
                }
                onInput={(key, val) =>{}}
                onSubmit={storeFrame}
                inputs={[
                    [
                        {
                            'type': 'text',
                            'name': 'name',
                            'label': 'نام',
                            'placeholder': 'نام قالب معنایی...',
                            'value': '',
                        },
                        {
                            'type': 'select',
                            'name': 'lang',
                            'label': 'زبان',
                            'value': FRAME_LANGUAGES['fa'],
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
                            'value': '',
                            'options': mirrors,
                            'placeholder': 'جستجو قالب معنایی...',
                            'customText' : (val: FrameInterface) =>{
                                return val.name;
                            },
                            'customComparator' : (val,current) =>{
                                return val._id === current;
                            },
                            'onInput': (name: string | undefined) => findMirrors(name)
                        },
                        {
                            'type': 'text',
                            'name': 'semanticType',
                            'label': 'گونه معنایی',
                            'placeholder': 'گونه معنایی...',
                            'value': '',
                        },

                    ],
                    [
                        {
                            'type': 'textarea',
                            'name': 'definition',
                            'label': 'تعریف',
                            'placeholder': 'تعریف قالب معنایی...',
                            'value':  '',
                        },
                    ]
                ]}
            />
        </>
    );
}
export default StoreFrame;