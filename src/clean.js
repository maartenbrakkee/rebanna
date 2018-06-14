import { conf } from "./nconf.js";

const fs = require("fs");
const rimraf = require("rimraf");

const dest = conf("destination");
const tmpDir = conf("tempFolder");

if (fs.existsSync(dest)){
  rimraf(dest, function () {
    // callback function required
  });
}
if (fs.existsSync(tmpDir)){
  rimraf(tmpDir, function () {
    // callback function required
  });
}
