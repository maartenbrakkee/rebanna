"use strict";

var _nconf = require("./nconf.js");

var _require = require("child_process"),
    exec = _require.exec;

var tmpDir = (0, _nconf.conf)("tempFolder");
var icons = (0, _nconf.conf)("iconFolder");

var cmd = "node ./node_modules/svgo/bin/svgo --config=\".svgo.yml\" --folder=\"" + icons + "\" --output=\"" + tmpDir + "\"";

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

  console.log(stdout);
  console.log("Compressing SVG's finished.");
});