"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("child_process"),
    exec = _require.exec;

var chalk = require("chalk");
var fs = require("fs");
var rimraf = require("rimraf");
var xml2js = require("xml2js");

var Rebanna = function () {
  function Rebanna() {
    _classCallCheck(this, Rebanna);

    this.help = "\n      Usage: rebanna " + chalk.blue("[command]") + " " + chalk.green("[options]") + "\n\n      " + chalk.blue("Commands:") + "\n\n          build\n\n              Run clean, compress and split commands, Builds the webfont. Before\n              building clean, compress and split commands will be run.\n\n          clean\n\n              Cleans the destination and temporary folder.\n\n          compress\n\n              Compresses all SVG files found in the icon source folder.\n\n          split\n\n              Split all compressed SVG files from the temporary folder.\n\n      " + chalk.green("Options:") + "\n\n          -c, --config\n\n              Path to a specific configuration file.\n\n          --debug\n\n              Show extra information for debugging.\n\n          -d, --destination\n\n              The destination for the generated webfont.\n\n          --fontName\n\n              The name for the font.\n\n          --fontClassName\n\n              The classname prefix for the icons.\n\n          -i, --iconFolder\n\n              The source folder for the icons.\n\n          --tempFolder\n\n              Temporary folder for processing.\n\n          --template\n\n              Nunjucks template for generating HTML, CSS or SCSS. More information\n              about Nunjucks templates can be found at: https://bit.ly/2v0E7Ha.\n    ";
    this.options = {
      config: "",
      debug: false,
      destination: "./font",
      fontName: "iconfont",
      fontClassName: "icon",
      iconFolder: "./icons",
      tempFolder: "./.tmp",
      template: "./templates/template.html.njk"
    };
  }

  _createClass(Rebanna, [{
    key: "build",
    value: function build() {
      var _self = this;
      var options = _self.options;

      _async2.default.series([function (callback) {
        _self.clean(callback);
      }, function (callback) {
        console.log("");
        _self.compress(callback);
      }, function (callback) {
        console.log("");
        _self.split(callback);
      }, function (callback) {
        console.log(chalk.white.bold("\n  Starting " + chalk.blue("build") + " command."));

        var cmd = "node ./node_modules/webfont/dist/cli.js \"" + options.tempFolder + "/*.svg\" --font-name=\"" + options.fontName + "\" --template-class-name=\"" + options.fontClassName + "\" --dest=\"" + options.destination + "/\" --template=\"" + options.template + "\" --fontHeight=1000";

        // create destionation folder if it doesn't exists
        if (!fs.existsSync(options.destination)) {
          fs.mkdirSync(options.destination);
        }

        // run command to create webfont
        exec(cmd, function (err, stdout, stderr) {
          if (err) {
            console.error("  \uD83D\uDCA5 ERROR: " + err);
            return;
          }

          if (stderr) {
            console.error("  \uD83D\uDCA5 ERROR: " + stderr);
            return;
          }

          console.log(chalk.white("  " + chalk.blue("build") + " command finished."));
          console.log("  Webfont succesfully created 😄 🎉");
          callback();
        });
      }]);
    }
  }, {
    key: "clean",
    value: function clean(callback) {
      var options = this.getOptions();
      var folders = [{
        name: "Destination",
        path: options.destination
      }, {
        name: "Temporary",
        path: options.tempFolder
      }];

      console.log(chalk.white.bold("  Starting " + chalk.blue("clean") + " command."));

      _async2.default.forEachSeries(folders, function (folder, cb) {
        if (fs.existsSync(folder.path)) {
          rimraf(folder.path + "/*", function () {
            console.log(chalk.white("  " + folder.name + " folder cleaned (" + chalk.gray(folder.path) + ")."));
            cb();
          });
        } else {
          // create folder (needed for compress command)
          fs.mkdirSync(folder.path);
          cb();
        }
      }, function (err) {
        if (err) {
          console.error(chalk.red.bold("  💥 ERROR: " + err));
          process.exit(1);
        } else {
          console.log(chalk.white("  " + chalk.blue("clean") + " command finished."));
          if (callback) {
            callback();
          }
        }
      });
    }
  }, {
    key: "compress",
    value: function compress(callback) {
      var options = this.getOptions();
      var cmd = "node ./node_modules/svgo/bin/svgo --config=\".svgo.yml\" --folder=\"" + options.iconFolder + "\" --output=\"" + options.tempFolder + "\"";

      console.log(chalk.white.bold("  Starting " + chalk.blue("compress") + " command."));

      // run command to create webfont
      exec(cmd, function (err, stdout, stderr) {
        if (err) {
          console.error(chalk.red.bold("  \uD83D\uDCA5 ERROR: " + err));
          return;
        }

        if (stderr) {
          console.error(chalk.red.bold("  \uD83D\uDCA5 ERROR: " + stderr));
          return;
        }

        console.log(chalk.white("  " + chalk.blue("compress") + " command finished."));
        if (callback) {
          callback();
        }
      });
    }
  }, {
    key: "split",
    value: function split(callback) {
      var options = this.getOptions();

      console.log(chalk.white.bold("  Starting " + chalk.blue("split") + " command."));
      console.log("  Checking directory for SVG files.");

      fs.readdir(options.tempFolder, function (err, files) {
        // exit on error
        if (err) {
          console.error(chalk.red.bold("  💥 ERROR: Could not list the directory.", err));
          process.exit(1);
        }

        // check if found files are svg files
        var svgFiles = [];

        files.forEach(function (file) {
          if (file.substr(file.length - 4) === ".svg") {
            svgFiles.push(file);
          }
        });

        // exit on no SVG images
        if (svgFiles.length === 0) {
          console.error(chalk.red.bold("  💥 ERROR: Couldn't find any SVG files."));
          process.exit(1);
        }

        if (svgFiles.length === 1) {
          console.log("  " + svgFiles.length + " SVG file found.");
        } else {
          console.log("  " + svgFiles.length + " SVG files found.");
        }

        svgFiles.forEach(function (file) {
          // start splitting
          fs.readFile(options.tempFolder + "/" + file, "utf-8", function (err, data) {
            if (err) {
              return console.error("  " + chalk.red.bold(err));
            }

            var parser = new xml2js.Parser();
            parser.parseString(data, function (err, result) {
              var groups = result.svg.g;

              if (typeof groups === "undefined") {
                console.error(chalk.red.bold("  💥 ERROR: The file \"" + chalk.gray(file) + "\" doesn't have any top level groups. See https://git.io/fN2o2 for more information."));
                process.exit(1);
              }

              if (result.svg.rect || result.svg.circle || result.svg.ellipse || result.svg.line || result.svg.polyline || result.svg.polygon || result.svg.path) {
                console.error(chalk.red.bold("  💥 ERROR: The file \"" + chalk.gray(file) + "\" contains top level elements that are not groups. See https://git.io/fN2o2 for more information."));
                process.exit(1);
              }

              if (groups.length > 6) {
                console.error(chalk.red.bold("  💥 ERROR: SVG has more then 6 top level groups. Icon font HTML support supports max. 6."));
                process.exit(1);
              }

              // delete file in .tmp folder
              fs.unlink(options.tempFolder + "/" + file, function (err) {
                if (err) {
                  throw err;
                }
              });

              // create seperate SVG's for each top level group
              var i = 0;
              groups.forEach(function (group) {
                // remove all groups
                delete result.svg.g;

                var className = "";
                if (typeof group.$ !== "undefined") {
                  if (typeof group.$.id !== "undefined") {
                    className = group.$.id;
                  }
                }

                // add only current group
                result.svg.g = group;

                var builder = new xml2js.Builder();
                var xml = builder.buildObject(result);

                className = className !== "" ? "-" + className : "";

                var fileName = file.substr(0, file.length - 4) + "-" + i + className + ".svg";

                fs.writeFile(options.tempFolder + "/" + fileName, xml, function (err) {
                  if (err) {
                    throw err;
                  }
                  if (options.debug) {
                    console.log("  The file \"" + chalk.gray(fileName) + "\" has been saved.");
                  }
                });
                i++;
              });
            });
          });
        });

        console.log(chalk.white("  " + chalk.blue("split") + " command finished."));
        if (callback) {
          callback();
        }
      });
    }
  }, {
    key: "run",
    value: function run(command, options) {
      // update options
      this.setOptions(options);

      // run command
      this[command]();
    }
  }, {
    key: "getHelp",
    value: function getHelp() {
      return this.help;
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      return this.options;
    }
  }, {
    key: "setOptions",
    value: function setOptions(optionsArray) {
      var config = "config" in optionsArray ? "./" + optionsArray.config : "./.rebanna.js";

      if (fs.existsSync(config)) {
        var configOptions = require("." + config);
        this.setOptionsFromArray(configOptions);
      }

      // populate options in class
      this.setOptionsFromArray(optionsArray);
    }
  }, {
    key: "setOptionsFromArray",
    value: function setOptionsFromArray(array) {
      for (var option in array) {
        this.options[option] = array[option];
      }
    }
  }]);

  return Rebanna;
}();

exports.default = Rebanna;