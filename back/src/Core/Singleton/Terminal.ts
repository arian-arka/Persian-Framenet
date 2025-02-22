const util = require('util');
const exec = util.promisify(require('child_process').exec);
class Terminal {
    async run(
        command: string,
    ) {
        try {
            const { stdout, stderr } = await exec(command);
            console.log('stdout:', typeof stdout);
            console.log('stderr:', typeof stderr);

            console.log('0----------------------------0');

            console.log('stdout:', stdout);
            console.log('stderr:', stderr);

        } catch (e) {
            console.error(e); // should contain code (exit code) and signal (that caused the termination).
        }
    }

    // async run(...command: string[]) {
    //     let p = command.length > 1 ? spawn(command[0], command.slice(1)) : spawn(command[0]);
    //     return new Promise((resolveFunc) => {
    //         p.stdout.on("data", (x) => {
    //             process.stdout.write(x.toString());
    //         });
    //         p.stderr.on("data", (x) => {
    //             process.stderr.write(x.toString());
    //         });
    //         p.on("exit", (code) => {
    //             resolveFunc(code);
    //         });
    //     });
    // }
}

export default new Terminal();