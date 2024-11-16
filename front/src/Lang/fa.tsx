export default {
    errors: {
        string: {
            required: (field: string | number) => `${field} لازم است`,
            min: (field: string | number, number: number) => `${field} حداقل ${number} تعداد کاراکتر دارد`,
            max: (field: string | number, number: number) => `${field} حداکثر ${number} تعداد کاراکتر دارد`,
            email: `ایمیل نا معتبر است`,
        },
        array: {
            required: (field: string | number) => `${field} خالی است`,
        },
        boolean: {
            required: (field: string | number) => `${field} خالی است`,
        }
    },

    keys: {
        sentence: {
            words: 'جمله',
        },
        user: {
            user: `کاربر`,
            name: `نام`,
            password: `رمز`,
            email: `ایمیل`,
            privileges: `دسترسی ها`,
            grant: `مجوز`
        },
        element: {
            semanticType: `نوع معنایی`,
            definition: `توضیحات`,
            color: `رنگ`,
            abbreviation: `مختصر`,
            type: `نوع`,
            user: `کاربر`,
            name: `نام`,
            password: `رمز`,
            email: `ایمیل`,
            privileges: `دسترسی ها`,
            grant: `مجوز`,
            excludes: `excludes`,
        },
        lexicalUnit: {
            semanticType: `نوع معنایی`,
            definition: `توضیحات`,
            color: `رنگ`,
            abbreviation: `مختصر`,
            type: `نوع`,
            user: `کاربر`,
            name: `نام`,
            password: `رمز`,
            email: `ایمیل`,
            privileges: `دسترسی ها`,
            grant: `مجوز`
        },
        taggedSentence: {
            message: `پیام`,
        },
        frame: {
            semanticType: `semanticType`,
            definition: `توضیحات`,
            color: `رنگ`,
            abbreviation: `مختصر`,
            type: `نوع`,
            user: `کاربر`,
            name: `نام`,
            message: `پیام`,
            password: `رمز`,
            email: `ایمیل`,
            privileges: `دسترسی ها`,
            grant: `مجوز`,
            status: {
                0: `نهایی شده`,
                1: `بدون تغییر`,
                2: `در حال ویرایش`,
                3: `در انتضار بررسی`,
                4: `برگشت خورده`,
            },
            language: {
                en: 'english',
                fa: 'فارسی',
            }
        }
    },

    items: {
        close: `بستن`,
    },

    footer: {
        allRights: `All rights reserved.`
    },

    toast: {
        tooManyRequests: `درخواست های شما بیش ار حد مجاز است.`,
        forbidden: `دسترسی ندارید.`,
    },

    table: {
        paginationNumbers: (number = undefined, totalSoFar = undefined, total = undefined) => {
            if (!number || number == 0)
                return '';
            if (totalSoFar && total)
                return `نمایش ${number} | ${totalSoFar} از ${total}`
            return `نمایش ${number} `;
        },
        paginationLastPage: `انتها`,
        paginationFirstPage: `ابتدا`,
        paginationPrevious: `قبل`,
        paginationNext: `بعد`,
        actionsText: `عملیات`,
        applyFilter: `اعمال`,
        cancelFilter: `بازگشت`
    },

    notification: {
        notification: `پیام‌ها`,
        all: `نمایش همه`
    },

    user: {
        privileges: {
            'store frame': `ساخت قالب معنایی`,
            'edit frame': `ویرایش قالب معنایی`,
            'delete frame': `حذف قالب معنایی`,
            'show frame': `مشاهده قالب معنایی`,
            'publish frame': `تایید قالب معنایی`,
            'refuse frame': `رد قالب معنایی`,

            'store sentence': `ساخت جمله`,
            'edit sentence': `ویرایش جمله`,
            'delete sentence': `حذف جمله`,
            'show sentence': `مشاهده جمله`,

            'store tagged sentence': `افزودن برچسب`,
            'edit tagged sentence': `ویرایش برچسب`,
            'delete tagged sentence': `حذف برچسب`,
            'show tagged sentence': `مشاهده برچسب`,
            'publish tagged sentence': `تایید برچسب`,
            'refuse tagged sentence': `رد برچسب`,

            'store user': `ساخت کاربر`,
            'edit user': `ویرایش کاربر`,
            'delete user': `حذف کاربر`,
            'show user': `مشاهده کاربر`,

            'store lexicalUnit': `ساخت واحد واژگانی`,
            'edit lexicalUnit': `ویرایش واحد واژگانی`,
            'delete lexicalUnit': `حذف واحد واژگانی`,

            'store element': `ساخت جزء معنایی`,
            'edit element': `ویرایش جزء معنایی`,
            'delete element': `حذف جزء معنایی`,

        },
        logs: {
            'store frame': `ساخت قالب معنایی`,
            'edit frame': `ویرایش قالب معنایی`,
            'delete frame': `حذف قالب معنایی`,
            'change frameStatus': `وضعیت قالب معنایی`,

            'store element': `ساخت جزء معنایی`,
            'edit element': `ویرایش جزء معنایی`,
            'delete element': `حذف جزء معنایی`,

            'store lexicalUnit': `ساخت واحد واژگانی`,
            'edit lexicalUnit': `ویرایش واحد واژگانی`,
            'delete lexicalUnit': `حذف واحد واژگانی`,

            'store sentence': `ساخت جمله`,
            'edit sentence': `ویرایش جمله`,
            'delete sentence': `حذف جمله`,

            'store taggedSentence': `ساخت برچسب جمله`,
            'edit taggedSentence': `ویرایش برچسب جمله`,
            'delete taggedSentence': `حذف برچسب جمله`,
            'change taggedSentenceStatus': `وضعیت برچسب جمله`,

            'store user': 50,
            'edit user': 51,
            'delete user': 52,

            'store frameRelation': `ساخت رابطه قالب معنایی`,
            'edit frameRelation': `ویرایش رابطه قالب معنایی`,
            'delete frameRelation': `حذف رابطه قالب معنایی`,
        }
    },

    frame: {
        status: {
            'unchanged': 'بدون تغییر',
            'published': 'نهایی شده',
            //waiting for agreement
            'editing': "در حال ویرایش",
            'waiting': 'در انتظار بررسی',
            'refused': 'رد شده',
        },
    },

    element : {
      type:{
          'Core':`مرکزی`,
          'Core-Unexpressed':`مرکزی بیان‌نشده`,
          'Non-Core' : `نامرکزی`,
          'Peripheral' : `حاشیه‌ای`,
          'Extra-Thematic' :`فراموضوعی`,
      }
    },

    frameRelations: {
        types: {
            "Has Subframe(s)": `زیرقالب(ها)`,
            "Inherits from": `والد(ها)`,
            "Is Causative of": `نوع سببی قالبِ`,
            "Is Inchoative of": `نوع آغازی قالبِ`,
            "Is Inherited by": `فرزند(ها)`,
            "Is Perspectivized in": `چشم‌انداز در`,
            "Is Preceded by": `قالب قبلی`,
            "Is Used by": `استفاده‌شده در`,
            "Perspective on": `قالب بدون چشم‌انداز`,
            "Precedes": `قالب بعدی`,
            "See also": `همچنین نگاه کنید`,
            "Subframe of": `قالب پیچیده`,
            "Uses": `استفاده از`,
        }
    }
}

