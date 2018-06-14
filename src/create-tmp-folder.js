import { conf } from "./nconf.js";

const fs = require("fs");

const tmpDir = conf("tempFolder");

if (!fs.existsSync(tmpDir)){
  fs.mkdirSync(tmpDir);
}
