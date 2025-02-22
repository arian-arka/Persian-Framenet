import {parentPort } from 'worker_threads';
import {TreeModel} from "../Tree.model";
import {FrameModel} from "../../Frame/Frame.model";
import mongoose from "mongoose";

async function generateData(data: any) {
    if (Array.isArray(data)) {
        for (let el of data)
            await generateData(el);
    } else {
        // @ts-ignore
        let englishFrame = await FrameModel.findOne({'_id': data.value}, {
            '_id': 1,
            'name': 1,
            'mirror': 1
        }).exec();
        let persianFrame = englishFrame?.mirror ? await FrameModel.findOne({'_id': englishFrame.mirror}, {
            '_id': 1,
            'name': 1
        }).exec() : null;
        data.value = {
            'english': {
                _id : englishFrame?._id.toString(),
                name : englishFrame?.name,
            },
            'persian': persianFrame ? {
                _id : persianFrame?._id.toString(),
                name : persianFrame?.name,
            } : null,
        };
        if (data.children)
            await generateData(data.children);
    }
}


mongoose.connection.on('disconnected',() => {
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^ disconnected ^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
})



// @ts-ignore
mongoose.connect(process.env.MONGODB_STRING).then(async (db) => {
    const all = await TreeModel.findOne({'name': 'inheritance'}).exec();
    console.log('len result',all?.tree.length);
    if (!all)
        parentPort?.postMessage({
            'data': []
        });
    else {
        await generateData(all.tree);
        parentPort?.postMessage({
            'data': all.tree
        })
    }
    console.log('mongoose connections count',mongoose.connections?.length ?? 0);
    console.log('mongoose connections count',mongoose.connections?.length ?? 0);
    if(mongoose.connections?.length > 0)
        await mongoose.connection.close();
})




