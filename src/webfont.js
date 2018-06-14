import { conf } from "./nconf.js";
const { exec } = require("child_process");
const fs = require("fs");

const tmpDir = conf("tempFolder");
const name = conf("fontName");
const dest = conf("destination");
const className = conf("fontClassName");
const template = conf("template");

let cmd = "node ./node_modules/webfont/dist/cli.js \"" + tmpDir + "/*.svg\" --font-name=\"" + name + "\" --template-class-name=\"" + className + "\" --dest=\"" + dest + "/\" --template=\"" + template + "\"";

// create destionation folder if it doesn't exists
if (!fs.existsSync(dest)){
  fs.mkdirSync(dest);
}

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

  console.log("Webfont succesfully created :)");
});
