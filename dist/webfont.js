"use strict";

var _nconf = require("./nconf.js");

var _require = require("child_process"),
    exec = _require.exec;

var fs = require("fs");

var tmpDir = (0, _nconf.conf)("tempFolder");
var name = (0, _nconf.conf)("fontName");
var dest = (0, _nconf.conf)("destination");
var className = (0, _nconf.conf)("fontClassName");
var template = (0, _nconf.conf)("template");

var cmd = "node ./node_modules/webfont/dist/cli.js \"" + tmpDir + "/*.svg\" --font-name=\"" + name + "\" --template-class-name=\"" + className + "\" --dest=\"" + dest + "/\" --template=\"" + template + "\"";

// create destionation folder if it doesn't exists
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest);
}

// run command to create webfont
exec(cmd, function (err, stdout, stderr) {
  if (err) {
    console.error("Error: " + err);
    return;
  }

  if (stderr) {
    console.error("Error: " + stderr);
    return;
  }

  console.log("Webfont succesfully created :)");
});