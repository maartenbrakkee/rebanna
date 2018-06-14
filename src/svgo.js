import { conf } from "./nconf.js";
const { exec } = require("child_process");

const tmpDir = conf("tempFolder");
const icons = conf("iconFolder");

let cmd = "node ./node_modules/svgo/bin/svgo --config=\".svgo.yml\" --folder=\"" + icons + "\" --output=\"" + tmpDir + "\"";

// run command to create webfont
exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err}`);
    return;
  }

  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }

  console.log(stdout);
  console.log("Compressing SVG's finished.");
});
