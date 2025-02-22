import {FastifyRequest} from "fastify";
import {Worker} from "worker_threads";
import Path from "../../Core/Singleton/Path";

function getInheritance() {
    return new Promise((resolve : any,reject) => {
        const worker = new Worker(Path.srcPath('../','dist/App/Tree/Workers/Inheritance.js'),{
            workerData:{}
        })
        worker.once('message',resolve);
        // worker.on('message',resolve);
        worker.on('error',reject);
        worker.on('exit', (code) => {

            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        })

    });
}

export default class TreeController {
    constructor() {
    }

    async inheritance(request: FastifyRequest) {
        return  await getInheritance();
    }

}
