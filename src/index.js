"use strict";

const { exec } = require("child_process");
const chalk = require("chalk");
const chokidar = require("chokidar");
const fs = require("fs");
const rimraf = require("rimraf");
const xml2js = require("xml2js");

import async from "async";

export default class Rebanna {
  constructor() {
    this.help = `
      Usage: rebanna ${chalk.blue("[command]")} ${chalk.green("[options]")}

      ${chalk.blue("Commands:")}

          build

              Run clean, compress and split commands, Builds the webfont. Before
              building clean, compress and split commands will be run.

          clean

              Cleans the destination and temporary folder.

          compress

              Compresses all SVG files found in the icon source folder.

          split

              Split all compressed SVG files from the temporary folder.

      ${chalk.green("Options:")}

          -c, --config

              Path to a specific configuration file.

          --debug

              Show extra information for debugging.

          -d, --destination

              The destination for the generated webfont.

          --fontName

              The name for the font.

          --fontClassName

              The classname prefix for the icons.

          -i, --iconFolder

              The source folder for the icons.

          --tempFolder

              Temporary folder for processing.

          --template

              Nunjucks template for generating HTML, CSS or SCSS. More information
              about Nunjucks templates can be found at: https://bit.ly/2v0E7Ha.
    `;
    this.options = {
      config: "",
      debug: false,
      destination: "./font",
      fontName: "iconfont",
      fontClassName: "icon",
      iconFolder: "./icons",
      tempFolder: "./.tmp",
      template: "./templates/template.html.njk",
      watch: false,
      watchRunner: false,
    };
  }

  build() {
    let _self = this;
    let options = _self.options;

    async.series([
      function(callback) {
        _self.clean(callback);
      },
      function(callback) {
        console.log("");
        _self.compress(callback);
      },
      function(callback) {
        console.log("");
        _self.split(callback);
      },
      function(callback) {
        console.log(chalk.white.bold("\n  Starting "+ chalk.blue("build") +" command."));

        fs.access(options.template, fs.constants.F_OK, (error) => {
          if (error) {
            options.template = "./node_modules/rebanna/" + options.template;
          }

          let cmd = "node ./node_modules/webfont/dist/cli.js \"" + options.tempFolder + "/*.svg\" --font-name=\"" + options.fontName + "\" --template-class-name=\"" + options.fontClassName + "\" --dest=\"" + options.destination + "/\" --template=\"" + options.template + "\" --fontHeight=1000";

          // create destionation folder if it doesn't exists
          if (!fs.existsSync(options.destination)){
            fs.mkdirSync(options.destination);
          }

          // run command to create webfont
          exec(cmd, (err, stdout, stderr) => {
            if (err) {
              console.error(chalk.red.bold(`  💥 ${err}`));
              return;
            }

            if (stderr) {
              console.error(chalk.red.bold(`  💥 ERROR: ${stderr}`));
              return;
            }

            console.log(chalk.white("  "+ chalk.blue("build") +" command finished."));
            console.log("  Webfont succesfully created 😄 🎉");
            callback();
          });
        });
      }
    ],
    function(err, results) {
      if(err) {
        console.error(chalk.red.bold("  💥 ERROR: " + err + results));
        process.exit(1);
      }

      // watch icon folder is watch option is enabled
      if(options.watch && !options.watchRunner) {
        // change watchRunner, thus running watch command once
        _self.options.watchRunner = true;

        let watcher = chokidar.watch(options.iconFolder, {
          ignoreInitial: true
        });

        console.log(chalk.white("\n  Starting watching iconFolder for changes."));

        watcher
          .on("all", (event, path) => {
            console.log(chalk.white("\n  File "+ path +" was changed ("+ chalk.gray(event) +").\n"));
            _self.build();
          });
      }
    });
  }

  clean(callback) {
    let options = this.getOptions();
    let folders = [
      {
        name: "Destination",
        path: options.destination
      },
      {
        name: "Temporary",
        path: options.tempFolder
      }
    ];

    console.log(chalk.white.bold("  Starting "+ chalk.blue("clean") +" command."));

    async.forEachSeries(folders, function(folder, cb) {
      if (fs.existsSync(folder.path)) {
        rimraf(folder.path + "/*", function () {
          console.log(chalk.white("  "+ folder.name +" folder cleaned ("+ chalk.gray(folder.path) + ")."));
          cb();
        });
      } else {
        // create folder (needed for compress command)
        fs.mkdirSync(folder.path);
        cb();
      }
    }, function(err) {
      if(err) {
        console.error(chalk.red.bold("  💥 ERROR: "+ err));
        process.exit(1);
      } else {
        console.log(chalk.white("  "+ chalk.blue("clean") +" command finished."));
        if(callback) {
          callback();
        }
      }
    });
  }

  compress(callback) {
    let options = this.getOptions();
    let svgoConfig = ".svgo.yml";

    fs.access(svgoConfig, fs.constants.F_OK, (error) => {
      if (error) {
        svgoConfig = "./node_modules/rebanna/.svgo.yml";
      }

      let cmd = "node ./node_modules/svgo/bin/svgo --config=\"" + svgoConfig + "\" --folder=\"" + options.iconFolder + "\" --output=\"" + options.tempFolder + "\"";

      console.log(chalk.white.bold("  Starting "+ chalk.blue("compress") +" command."));

      // run command to create webfont
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.error(chalk.red.bold(`  💥 ${err}`));
          return;
        }

        if (stderr) {
          console.error(chalk.red.bold(`  💥 ERROR: ${stderr}`));
          return;
        }

        console.log(chalk.white("  "+ chalk.blue("compress") +" command finished."));
        if(callback) {
          callback();
        }
      });

    });
  }

  split(callback) {
    let options = this.getOptions();

    console.log(chalk.white.bold("  Starting "+ chalk.blue("split") +" command."));
    console.log("  Checking directory for SVG files.");

    fs.readdir(options.tempFolder, function(err, files) {
      // exit on error
      if(err) {
        console.error(chalk.red.bold("  💥 ERROR: Could not list the directory.", err));
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
        console.error(chalk.red.bold("  💥 ERROR: Couldn't find any SVG files."));
        process.exit(1);
      }

      if(svgFiles.length === 1) {
        console.log("  " + svgFiles.length + " SVG file found.");
      } else {
        console.log("  " + svgFiles.length + " SVG files found.");
      }

      svgFiles.forEach(function(file) {
        // start splitting
        fs.readFile(options.tempFolder + "/" + file, "utf-8", function(err, data) {
          if (err) {
            return console.error("  " + chalk.red.bold(err));
          }

          let parser = new xml2js.Parser();
          parser.parseString(data, function (err, result) {
            let groups = result.svg.g;

            if(typeof(groups) === "undefined") {
              console.error(chalk.red.bold("  💥 ERROR: The file \""+ chalk.gray(file) +"\" doesn't have any top level groups. See https://git.io/fN2o2 for more information."));
              process.exit(1);
            }

            if(result.svg.rect || result.svg.circle || result.svg.ellipse || result.svg.line || result.svg.polyline || result.svg.polygon || result.svg.path) {
              console.error(chalk.red.bold("  💥 ERROR: The file \""+ chalk.gray(file) +"\" contains top level elements that are not groups. See https://git.io/fN2o2 for more information."));
              process.exit(1);
            }

            if(groups.length > 6) {
              console.error(chalk.red.bold("  💥 ERROR: SVG has more then 6 top level groups. Icon font HTML support supports max. 6."));
              process.exit(1);
            }

            // delete file in .tmp folder
            fs.unlink(options.tempFolder + "/" + file, (err) => {
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

              className = (className !== "" ? "___" + className : "");

              let fileName = file.substr(0, file.length - 4) + "___" + i + className + ".svg";

              fs.writeFile(options.tempFolder + "/" + fileName, xml, (err) => {
                if (err) {
                  throw err;
                }
                if(options.debug) {
                  console.log("  The file \"" + chalk.gray(fileName) + "\" has been saved.");
                }
              });
              i++;
            });
          });
        });
      });

      console.log(chalk.white("  "+ chalk.blue("split") +" command finished."));
      if(callback) {
        callback();
      }
    });
  }

  run(command, options) {
    // update options
    this.setOptions(options);

    // run command
    this[command]();
  }

  getHelp() {
    return this.help;
  }

  getOptions() {
    return this.options;
  }

  setOptions(optionsArray) {
    let config = ("config" in optionsArray ? "./" +  optionsArray.config : "./.rebanna.js");

    fs.access(config, fs.constants.F_OK, (error) => {
      if (error) {
        // populate options in class
        this.setOptionsFromArray(optionsArray);
      } else {
        let workingDir = process.cwd();
        let configOptions = require(workingDir + "/" + config);
        this.setOptionsFromArray(configOptions);
      }
    });
  }

  setOptionsFromArray(array) {
    for (let option in array) {
      this.options[option] = array[option];
    }
  }
}
