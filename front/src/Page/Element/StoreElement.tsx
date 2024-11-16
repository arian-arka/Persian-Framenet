import {Component, createSignal} from "solid-js";
import Form from "../../Component/Form";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import {useLocalData} from "../../Core/LocalData";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {useToast} from "../../Component/Toast";
import ElementApi from "../../Api/Element.api";
import {useParams} from "@solidjs/router";
import {ELEMENT_TYPE} from "../../Constant/Element";

const StoreElement: Component = () => {
    const params = useParams<{frame:string}>();
    const localData = useLocalData();
    const toast=useToast();
    const [errors,setErrors] = createSignal<any>({},{equals:false});
    const storeElement = async (values:any, setLoading:Function) => {
        console.log(values);
        setLoading(true);
        try{
            const ok = await (new ElementApi()).store(params.frame,values ).fetch()
            localData.navigate(`/element/edit/${ok.data._id}`);
            toast.success('با موفقیت ذخیره شد');
        }catch (e) {
            console.log(e);
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
    document.title = 'ساخت جز معنایی';
    return (
        <>
            <Form
                errors={errors()}
                header={
                    <div class="mx-auto max-w-screen-xl mb-2">
                        <h2 class="mb-4 text-3xl leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">ساخت
                            اجزای معنایی</h2>
                    </div>
                }
                onInput={(key, val) =>{}}
                onSubmit={storeElement}
                inputs={[
                    [
                        {
                            'type': 'text',
                            'name': 'name',
                            'label': 'نام',
                            'placeholder': 'نام اجزای معنایی...',
                            'value': '',
                        },
                        {
                            'type': 'select',
                            'name': 'type',
                            'label': 'نوع',
                            'value': '',
                            'options': [
                                {
                                    text : 'انتخاب',
                                    value : ''
                                },
                                ...Object.keys(ELEMENT_TYPE).map((text) => {
                                    return {
                                        'text': text,
                                        // @ts-ignore
                                        'value': `${ELEMENT_TYPE[text]}`,
                                    }
                                })
                            ]
                        },
                    ],
                    [
                        {
                            'type': 'text',
                            'name': 'abbreviation',
                            'label': 'کوتاه',
                            'placeholder': '...',
                            'value': '',
                        },
                        {
                            'type': 'text',
                            'name': 'semanticType',
                            'label': 'گونه معنایی',
                            'placeholder': '...',
                            'value': '',
                        },
                    ],
                    [
                        {
                            'type': 'text',
                            'name': 'excludes',
                            'label': 'مانع می‌شود از',
                            'placeholder': '...',
                            'value': '',
                        },
                        {
                            'type': 'color',
                            'name': 'color',
                            'label': 'رنگ',
                            'placeholder': 'رنگ اجزای معنایی...',
                            'value': '',
                        },
                    ],
                    [

                        {
                            'type': 'textarea',
                            'name': 'definition',
                            'label': 'تعریف',
                            'placeholder': 'تعریف اجزای معنایی...',
                            'value': '',
                        },
                    ],
                ]}
            />
        </>
    );
}
export default StoreElement;