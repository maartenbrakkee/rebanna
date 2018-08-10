#!/usr/bin/env node

"use strict";

var _meow = require("meow");

var _meow2 = _interopRequireDefault(_meow);

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rebanna = new _index2.default();
var chalk = require("chalk");
var cli = (0, _meow2.default)(rebanna.getHelp(), {
  flags: {
    clean: {
      type: "boolean",
      default: false
    },
    config: {
      type: "string",
      alias: "c"
    },
    debug: {
      type: "boolean"
    },
    destination: {
      type: "string",
      alias: "d"
    },
    fontName: {
      type: "string"
    },
    fontClassName: {
      type: "string"
    },
    fontTemplatePath: {
      type: "string"
    },
    iconFolder: {
      type: "string",
      alias: "i"
    },
    tempFolder: {
      type: "string"
    },
    template: {
      type: "string"
    },
    watch: {
      type: "boolean",
      default: false
    }
  }
});

function runRebanna(input, flags) {
  var command = input.filter(function (element) {
    return element !== "rebanna";
  });
  var commands = ["build", "clean", "compress", "split"];

  console.log("\n  " + chalk.yellow.bold("Starting Rebanna...\n"));

  // exit on multiple commands
  if (command.length !== 1) {
    console.error(chalk.red.bold("  💥 ERROR: Multiple commands (" + command.join(", ") + ") found.\n"));
    console.error(chalk.white("  Only one command is allowed. Run " + chalk.gray("rebanna --help") + " for usage information."));
    process.exit(1);
  }

  // command not found
  if (!commands.includes(command[0])) {
    console.error(chalk.red.bold("  💥 ERROR: Unknown command (" + command[0] + ") found.\n"));
    console.error(chalk.white("  Run " + chalk.gray("rebanna --help") + " for usage information."));
    process.exit(1);
  }

  rebanna.run(command[0], flags);
}

runRebanna(cli.input, cli.flags);