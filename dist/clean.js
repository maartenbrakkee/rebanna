"use strict";

var _nconf = require("./nconf.js");

var fs = require("fs");
var rimraf = require("rimraf");

var dest = (0, _nconf.conf)("destination");
var tmpDir = (0, _nconf.conf)("tempFolder");

if (fs.existsSync(dest)) {
  rimraf(dest, function () {
    // callback function required
  });
}
if (fs.existsSync(tmpDir)) {
  rimraf(tmpDir, function () {
    // callback function required
  });
}