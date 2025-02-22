import File from "../Core/Singleton/File";
import Path from "../Core/Singleton/Path";

export default (env : NodeJS.ProcessEnv) : object => {
    return {
        limits: {
            fieldNameSize: 255, // Max field name size in bytes
            fieldSize: 255,     // Max field value size in bytes
            fields: 20,         // Max number of non-file fields
            fileSize: 1_000_000_000,  // For multipart forms, the max file size in bytes
            files: 10,           // Max number of file fields
            headerPairs: 2000   // Max number of header key=>value pairs
        },

        base :Path.projectPath('___TMP___') ,

        name: (name : string, ext : string) : string => {
            return File.randomName(ext);
        },

        defaults : {
            file : {
                maxCount : 1,
                required : false,
                size : 1_000_000, // bytes
            },
            nonFile : {
                fileNameSize : 255, // bytes
                fieldSize : 10_000, // bytes,
                fields : 20 // count
            }
        }
    };
};