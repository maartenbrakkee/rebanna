import { conf } from "./nconf.js";

const fs = require("fs");
const xml2js = require("xml2js");
const tmpDir = conf("tempFolder");

console.log("Checking directory for SVG files.");

fs.readdir(tmpDir, function(err, files) {
  // exit on error
  if(err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  // check if found files are svg files
  let svgFiles = [];

  files.forEach(function(file) {
    if(file.substr(file.length - 4) === ".svg") {
      svgFiles.push(file);
    }
  });

  // exit on no SVG images
  if(svgFiles.length === 0) {
    console.error("Couldn't find any SVG files.");
    process.exit(1);
  }

  console.log(svgFiles.length + " SVG file(s) found.\n");

  svgFiles.forEach(function(file) {
    // start splitting
    fs.readFile(tmpDir + "/" + file, "utf-8", function(err, data) {
      if (err) {
        return console.error(err);
      }

      let parser = new xml2js.Parser();
      parser.parseString(data, function (err, result) {
        let groups = result.svg.g;

        if(groups.length > 6) {
          console.error("SVG has more then 6 top level groups. Icon font HTML support supports max. 6.");
          return;
        }

        // delete file in .tmp folder
        fs.unlink(tmpDir + "/" + file, (err) => {
          if (err) {
            throw err;
          }
        });

        // create seperate SVG's for each top level group
        let i = 0;
        groups.forEach(function(group) {
          // remove all groups
          delete result.svg.g;

          let className = "";
          if (typeof group.$ !== "undefined") {
            if (typeof group.$.id !== "undefined") {
              className = group.$.id;
            }
          }

          // add only current group
          result.svg.g = group;

          let builder = new xml2js.Builder();
          let xml = builder.buildObject(result);

          className = (className !== "" ? "-" + className : "");

          let fileName = file.substr(0, file.length - 4) + "-" + i + className + ".svg";

          fs.writeFile(tmpDir + "/" + fileName, xml, (err) => {
            if (err) {
              throw err;
            }
            console.log("The file \"" + fileName + "\" has been saved.");
          });
          i++;
        });
      });
    });
  });
});
