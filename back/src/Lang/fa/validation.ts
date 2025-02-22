export default {
    type : `نوع داده اشتباه است.`,

    fields : {
        elementName : `عنوان`,
        elementType : `نوع`,
        elementDefinition : `تعریف`,
        elementColor : `رنگ`,

        lexicalUnitName : `عنوان`,
        lexicalUnitType : `نوع`,
        lexicalUnitDefinition : `تعریف`,

        frameName : `عنوان`,
        frameLang : `زبان`,
        frameDefinition : `تعریف`,

        sentenceWords : `جمله`,

        taggedSentencePropBankTags : `برچسب های Prop bank لازم است.`,
        taggedSentenceFrameNetTags : `برچسب های Frame net لازم است.`,

        frameRelationName : `نام`,
        frameRelationFrame : `قالب معنایی`,

        userName : `نام`,
        userEmail : `ایمیل`,
        userPassword : `رمز`,
    },

    required : (field : string,fieldKey?:string|undefined|null) => {
        // @ts-ignore
        return (!!fieldKey ? field : fieldKey)+'|'+`فیلد ${this.default.fields[field]} لازم است.`
    },

    email : `ایمیل نامعتبر است.`,

    password : `رمز باید بین 8 تا 64 کاراکتر باشد.`,

    user : {
        invalidUser : `کاربر نامعتبر است.`,
        emailExists : (email : string) => `ایمیل ${email} موجود است.`,
        name : `نام باید بین 1 تا 300 کاراکتر باشد.`,
        invalidLogin : `ایمیل یا رمز اشتباه است.`,
        email : `ایمیل نامعتبر است.`,
        password : `رمز باید بین 8 تا 64 کاراکتر باشد.`,
        privileges : `دسترسی ها نامعتبر است.`,
        oldPassword : `رمز اشتباه است.`,
        newPassword : `رمز جدید باید بین 8 تا 64 کاراکتر باشد.`,
    },

    frame:{
        name : `عنوان باید بین 1 تا 500 کاراکتر باشد.`,
        semanticType : `semanticType باید بین 1 تا 500 کاراکتر باشد.`,
        lang : `زبان نامعتبر است.`,
        status : `وضعیت نامعتبر است.`,
        definition : `تعریف باید بین 1 تا 5000 کاراکتر باشد.`,
        mirror : `فریم مقابل نامعتبر است.`,
        nameExists : `عنوان فریم از قبل موجود است.`
    },

    element:{
        name : `نام باید بین 1 تا 500 کاراکتر باشد.`,
        type : `نوع نامعتبر است.`,
        definition : `تعریف باید بین 1 تا 5000 کاراکتر باشد.`,
        color: `رنگ نامعتبر است.`,
        semanticType: `semanticType باید بین 1 تا 500 کاراکتر باشد.`,
        abbreviation: `مختصر باید بین 1 تا 500 کاراکتر باشد.`,
        excludes: `excludes باید بین 1 تا 500 کاراکتر باشد.`,
    },
    frameRelation:{
        name : `عنوان باید بین 1 تا 500 کاراکتر باشد.`,
        frame : `قالب معنایی نامعتبر است.`,
    },

    lexicalUnit:{
        name : `نام باید بین 1 تا 500 کاراکتر باشد.`,
        type : `نوع نامعتبر است.`,
        frameExists : `این نام موجود است.`,
        definition : `تعریف باید بین 1 تا 5000 کاراکتر باشد.`,
    },

    sentence:{
        words : `حداکثر 200 کلمه(هر کدام حداکثر 300 کاراکتر) مجاز است.`,
        wordsExists:`این جمله موجود است.`,
    },

    taggedSentence:{
        propBankTags : `برچسب های Prop bank نامعتبر یا خالی است.`,
        frameNetTags : `برچسب های Frame net نامعتبر یا خالی است.`,
        frame:`قاب معنایی نامعتبر است.`,
        lexicalUnit:`واحد واژگانی نامعتبر است.`,
        status : `وضعیت نامعتبر است.`,
    },

};