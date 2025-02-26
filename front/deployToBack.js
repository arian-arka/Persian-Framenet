const fs = require('fs');
const path = require('path');
const { execSync } = require("child_process");

fs.writeFileSync(`./src/env.ts`,`export default {base : '${process.argv[2] ?? 'http://127.0.0.1:3000'}/api'}`,{encoding:'utf8',flag:'w'})
execSync(`npm run build && cp -a ./dist/assets ../back/public && cp -a ./dist/index.html ../back/public`);

