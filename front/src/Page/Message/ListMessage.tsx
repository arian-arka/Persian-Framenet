import {Component, createEffect, createSignal} from "solid-js";
import {useToast} from "../../Component/Toast";
import {useLocalData} from "../../Core/LocalData";
import Table from "../../Component/Table";
import {A} from "@solidjs/router";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import MessageApi from "../../Api/Message.api";
import {MessagePaginatedInterface} from "../../Type/Message.interface";
import {MESSAGE_FOR} from "../../Constant/Message";
import {FRAME_LANGUAGES} from "../../Constant/Frame";

const ListMessage: Component = () => {
    const toast = useToast();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const [data, setData] = createSignal<any>(undefined, {equals: false});
    const [pagination, setPagination] = createSignal<any>(undefined, {equals: false});
    const localData = useLocalData();

    const fetchList = async (filters: any) => {
        setRows(undefined);
        console.log('filters', filters);
        const _filters = {
            ...filters,
            isFor: filters.isFor !== '' ? parseInt(filters.isFor) : null,
            page: filters.page !== '' ? parseInt(filters.page) : 1,
            opened: !!filters.openedAt ? (filters.openedAt === '1') : null,
            limit: 50,
            linkPerPage: 5
        };


        await (new MessageApi()).list(_filters).forever({
            ok(r: Ok<MessagePaginatedInterface>) {
                Log.success('message', r.data);
                setRows(r.data.data);
                setPagination(r.data.pagination);
            },
            unAuthenticated(r: BadRequest) {
                localData.navigate('/login');
            },
            bad(r: BadRequest) {
                Log.danger('message', r);
            }
        });
    }
    const openLink = async (e, _id, l) => {
        try {
            await (new MessageApi()).open(_id).fetch();
            const _ = rows();
            for (let i = 0; i < _.length; i++){
                if (_[i]['_id'] === _id){
                    _[i]['openedAt'] = '1';
                }
            }
            setRows(_);
            return true;
        } catch (e) {
            toast.warning('دوباره تلاش کنید');
        }
        return false;
    }

    fetchList({
        page: 1,
        openedAt: null,
        isFor: null,
    });

    document.title = 'پیام‌ها';

    return (
        <>
            <Table
                limits={[50, 100, 250, 500, 1000, 1500, 2000, 2500]}
                onFilter={(v: any) => {
                    setData(v);
                    fetchList({...data(), page: 1})
                }}
                filters={[
                    {
                        name: 'openedAt',
                        value: '',
                        type: 'select',
                        label: 'باز شده',
                        options: [
                            {
                                text: 'همه',
                                value: '',
                            },
                            {
                                text: 'بلی',
                                value: '1',
                            },
                            {
                                text: 'خیر',
                                value: '0',
                            },
                        ],
                    },
                ]}
                pagination={pagination()}
                onPage={async (page: any) => await fetchList({...data(), 'page': page as unknown as number})}
                header={'پیام‌ها'}
                columns={[
                    {
                        key: 'ref',
                        text: 'بخش مرتبط',
                        customValue(val, row) {
                            if (val && val.length !== 0) {
                                const l = row.isFor === MESSAGE_FOR['frame'] ? `/frame/${val}` : (row.isFor === MESSAGE_FOR['taggedSentence'] ? `/taggedSentence/edit/${val}` : `/lexicalUnit/edit/${val}`);
                                return <A onClick={async (e) => {
                                    if ('openedAt' in row && row.openedAt === true)
                                        return true;
                                    else
                                        return await openLink(e, row['_id'], l);
                                }} href={l} target="_blank"
                                          class="font-medium text-gray-800 dark:text-blue-500 hover:underline">لینک</A>
                            }

                            return '-';
                        }
                    },
                    {
                        key: 'isFor',
                        text: 'برای',
                        customValue(val, row) {
                            return val === MESSAGE_FOR['frame'] ? 'قاب معنایی' : (val === MESSAGE_FOR['taggedSentence'] ? 'برچسب نگاری' : (val === MESSAGE_FOR['lexicalUnit'] ? 'واحد واژگانی' : 'جزء معنایی'));
                        }
                    },
                    {
                        key: 'openedAt',
                        text: 'باز شده',
                        customValue(val, row) {
                            return 'openedAt' in row && !!row.openedAt ? 'خوانده شده' : '-';
                        }
                    },
                    {
                        key: 'refText',
                        text: 'متن',
                    },
                    {
                        key: 'message',
                        text: 'پیام',
                    },

                ]}
                rows={rows()}
            />
        </>
    );
}
export default ListMessage;