"use strict";

var _nconf = require("./nconf.js");

var fs = require("fs");

var tmpDir = (0, _nconf.conf)("tempFolder");

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}