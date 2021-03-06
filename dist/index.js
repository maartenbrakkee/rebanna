"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _async = _interopRequireDefault(require("async"));

var _nunjucks = _interopRequireDefault(require("nunjucks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("child_process"),
    exec = _require.exec;

var chalk = require("chalk");

var chokidar = require("chokidar");

var fs = require("fs");

var rimraf = require("rimraf");

var xml2js = require("xml2js");

var Rebanna = /*#__PURE__*/function () {
  function Rebanna() {
    _classCallCheck(this, Rebanna);

    this.help = "\n      Usage: rebanna ".concat(chalk.blue("[command]"), " ").concat(chalk.green("[options]"), "\n\n      ").concat(chalk.blue("Commands:"), "\n\n          build\n\n              Run clean, compress and split commands, Builds the webfont. Before\n              building clean, compress and split commands will be run.\n\n          clean\n\n              Cleans the destination and temporary folder.\n\n          compress\n\n              Compresses all SVG files found in the icon source folder.\n\n          split\n\n              Split all compressed SVG files from the temporary folder.\n\n      ").concat(chalk.green("Options:"), "\n\n          --clean\n\n              Clean also on build.\n\n          -c, --config\n\n              Path to a specific configuration file.\n\n          --debug\n\n              Show extra information for debugging.\n\n          -d, --destination\n\n              The destination for the generated webfont.\n\n          --fontName\n\n              The name for the font.\n\n          --fontClassName\n\n              The classname prefix for the icons.\n\n          --fontTemplatePath\n\n              Font path that will be used in generated templates.\n\n          -i, --iconFolder\n\n              The source folder for the icons.\n\n          --tempFolder\n\n              Temporary folder for processing.\n\n          --template\n\n              An array of Nunjucks template for generating HTML, CSS or SCSS.\n              More information about Nunjucks templates can be found at\n              https://bit.ly/2v0E7Ha.\n\n          --watch\n\n              Add this option if you want the iconFolder to be watched. Triggers\n              ").concat(chalk.blue("build"), " on added, changed or removed file.\n\n    ");
    this.options = {
      clean: false,
      config: "",
      debug: false,
      destination: "./font",
      fontName: "iconfont",
      fontClassName: "icon",
      fontTemplatePath: "./font",
      iconFolder: "./icons",
      jsonTemplate: "./templates/template.js.njk",
      tempFolder: "./.tmp",
      template: ["./templates/iconfont.css.njk", "./templates/iconfont.html.njk", "./templates/iconfont.scss.njk"],
      watch: false,
      watchRunner: false
    };
  }

  _createClass(Rebanna, [{
    key: "build",
    value: function build() {
      var _self = this;

      var options = _self.options;

      _async["default"].series([function (callback) {
        _self.clean(callback);
      }, function (callback) {
        console.log("");

        _self.compress(callback);
      }, function (callback) {
        console.log("");

        _self.split(callback);
      }, function (callback) {
        console.log(chalk.white.bold("\n  Starting " + chalk.blue("build") + " command."));

        _self.webfont(callback);
      }, function (callback) {
        _self.createTemplates(callback);
      }], function (err, results) {
        if (err) {
          console.error(chalk.red.bold("  💥 ERROR: " + err + results));
          process.exit(1);
        }

        console.log(chalk.white("  " + chalk.blue("build") + " command finished.")); // watch icon folder is watch option is enabled

        if (options.watch && !options.watchRunner) {
          // change watchRunner, thus running watch command once
          _self.options.watchRunner = true;
          var watcher = chokidar.watch(options.iconFolder, {
            ignoreInitial: true
          });
          console.log(chalk.white("\n  Starting watching iconFolder for changes."));
          watcher.on("all", function (event, path) {
            console.log(chalk.white("\n  File " + path + " was changed (" + chalk.gray(event) + ").\n"));

            _self.build();
          });
        }
      });
    }
  }, {
    key: "clean",
    value: function clean(callback) {
      var options = this.options;
      var folders = [{
        name: "Destination",
        path: options.destination
      }, {
        name: "Temporary",
        path: options.tempFolder
      }];

      if (!options.clean) {
        folders = folders.splice(1, 1);
      }

      console.log(chalk.white.bold("  Starting " + chalk.blue("clean") + " command."));

      _async["default"].forEachSeries(folders, function (folder, cb) {
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
      var svgoConfig = ".svgo.yml";
      fs.access(svgoConfig, fs.constants.F_OK, function (error) {
        if (error) {
          svgoConfig = "./node_modules/rebanna/.svgo.yml";
        }

        var cmd = "node ./node_modules/svgo/bin/svgo --config=\"" + svgoConfig + "\" --folder=\"" + options.iconFolder + "\" --output=\"" + options.tempFolder + "\"";
        console.log(chalk.white.bold("  Starting " + chalk.blue("compress") + " command.")); // run command to create webfont

        exec(cmd, function (err, stdout, stderr) {
          if (err) {
            console.error(chalk.red.bold("  \uD83D\uDCA5 ".concat(err)));
            return;
          }

          if (stderr) {
            console.error(chalk.red.bold("  \uD83D\uDCA5 ERROR: ".concat(stderr)));
            return;
          }

          console.log(chalk.white("  " + chalk.blue("compress") + " command finished."));

          if (callback) {
            callback();
          }
        });
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
        } // check if found files are svg files


        var svgFiles = [];
        files.forEach(function (file) {
          if (file.substr(file.length - 4) === ".svg") {
            svgFiles.push(file);
          }
        }); // exit on no SVG images

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
                console.error(chalk.red.bold("  💥 ERROR: The file \"" + chalk.gray(file) + "\" doesn't have any top-level groups. See https://git.io/fN2o2 for more information."));
                process.exit(1);
              }

              if (result.svg.rect || result.svg.circle || result.svg.ellipse || result.svg.line || result.svg.polyline || result.svg.polygon || result.svg.path) {
                console.error(chalk.red.bold("  💥 ERROR: The file \"" + chalk.gray(file) + "\" contains top-level elements that are not groups. See https://git.io/fN2o2 for more information."));
                process.exit(1);
              }

              if (groups.length > 6) {
                console.error(chalk.red.bold("  💥 ERROR: SVG has more than 6 top-level groups. Icon font HTML support supports max. 6."));
                process.exit(1);
              } // delete file in .tmp folder


              fs.unlink(options.tempFolder + "/" + file, function (err) {
                if (err) {
                  throw err;
                }
              }); // create seperate SVG's for each top-level group

              var i = 0;
              groups.forEach(function (group) {
                // remove all groups
                delete result.svg.g;
                var className = "";

                if (typeof group.$ !== "undefined") {
                  if (typeof group.$.id !== "undefined") {
                    className = group.$.id;
                  }
                } // add only current group


                result.svg.g = group;
                var builder = new xml2js.Builder();
                var xml = builder.buildObject(result);
                className = className !== "" ? "___" + className : "";
                var fileName = file.substr(0, file.length - 4) + "___" + i + className + ".svg";
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
    key: "webfont",
    value: function webfont(callback) {
      var options = this.options;
      var jsonTemplate = options.jsonTemplate;
      fs.access(jsonTemplate, fs.constants.F_OK, function (error) {
        if (error) {
          jsonTemplate = "./node_modules/rebanna/" + jsonTemplate;
          options.jsonTemplate = jsonTemplate;
        }

        var cmd = "node ./node_modules/webfont/dist/cli.js \"" + options.tempFolder + "/*.svg\" --font-name=\"" + options.fontName + "\" --template-class-name=\"" + options.fontClassName + "\" --dest=\"" + options.destination + "/\" --template=\"" + jsonTemplate + "\" --template-font-path=\"" + options.fontTemplatePath + "\" --fontHeight=1000"; // create destionation folder if it doesn't exists

        if (!fs.existsSync(options.destination)) {
          fs.mkdirSync(options.destination);
        } // run command to create webfont


        exec(cmd, function (err, stdout, stderr) {
          if (err) {
            console.error(chalk.red.bold("  \uD83D\uDCA5 ".concat(err)));
            return;
          }

          if (stderr) {
            console.error(chalk.red.bold("  \uD83D\uDCA5 ERROR: ".concat(stderr)));
            return;
          }

          console.log("  Webfont succesfully created.");
          callback();
        });
      });
    }
  }, {
    key: "createTemplates",
    value: function createTemplates(callback) {
      // remove .njk from string and update path
      var options = this.options;
      var jsonTemplate = options.jsonTemplate.slice(0, -4).split("/");
      jsonTemplate = options.destination + "/" + jsonTemplate[jsonTemplate.length - 1]; // read generated json

      fs.access(jsonTemplate, fs.constants.F_OK, function (error) {
        if (error) {
          console.error(chalk.red.bold("  💥 " + error));
        }

        var workingDir = process.cwd();

        var nunjucksOptions = require(workingDir + "/" + jsonTemplate);

        var result;

        _async["default"].eachOf(options.template, function (template, key, callback) {
          console.log(chalk.white.bold("  Creating template (" + chalk.gray(template) + ")."));
          fs.access(template, fs.constants.F_OK, function (error) {
            if (error) {
              template = "./node_modules/rebanna/" + template;
            }

            result = _nunjucks["default"].render(workingDir + "/" + template, nunjucksOptions); // remove .njk from string and update path

            var templateExport = template.slice(0, -4).split("/");
            templateExport = options.destination + "/" + templateExport[templateExport.length - 1];
            fs.writeFile(templateExport, result, function (error) {
              if (error) {
                console.error(chalk.red.bold("  💥 " + error));
              }

              console.log(chalk.white.bold("  Template (" + chalk.gray(templateExport) + ") saved."));
              callback();
            });
          });
        }, function (error) {
          if (error) {
            console.error(chalk.red.bold("  💥 " + error));
          }

          callback();
        });
      });
    }
  }, {
    key: "run",
    value: function run(command, options) {
      var _self = this; // update options


      this.setOptions(options, function () {
        // run command
        _self[command]();
      });
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
    value: function setOptions(optionsArray, callback) {
      var _this = this;

      var config = "config" in optionsArray ? "./" + optionsArray.config : "./.rebanna.js";
      fs.access(config, fs.constants.F_OK, function (error) {
        if (!error) {
          var workingDir = process.cwd();

          var configOptions = require(workingDir + "/" + config);

          _this.setOptionsFromArray(configOptions);
        } // always populate options from commandline


        _this.setOptionsFromArray(optionsArray);

        callback();
      });
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

exports["default"] = Rebanna;