#!/usr/bin/env node
"use strict";

import meow from "meow";
import Rebanna from "./index";

const rebanna = new Rebanna();
const chalk = require("chalk");
const cli = meow(
  rebanna.getHelp(),
  {
    flags: {
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
        type: "string",
      },
      fontClassName: {
        type: "string",
      },
      iconFolder: {
        type: "string",
        alias: "i"
      },
      tempFolder: {
        type: "string",
      },
      template: {
        type: "string",
      },
      watch: {
        type: "boolean",
        default: false,
      },
    }
  }
);

function runRebanna(input, flags) {
  let command = input.filter(element => element !== "rebanna");
  let commands = ["build", "clean", "compress", "split"];

  console.log("\n  "+ chalk.yellow.bold("Starting Rebanna...\n"));

  // exit on multiple commands
  if(command.length !== 1) {
    console.error(chalk.red.bold("  💥 ERROR: Multiple commands ("+ command.join(", ") +") found.\n"));
    console.error(chalk.white("  Only one command is allowed. Run "+ chalk.gray("rebanna --help") + " for usage information."));
    process.exit(1);
  }

  // command not found
  if(!commands.includes(command[0])) {
    console.error(chalk.red.bold("  💥 ERROR: Unknown command ("+ command[0] +") found.\n"));
    console.error(chalk.white("  Run "+ chalk.gray("rebanna --help") + " for usage information."));
    process.exit(1);
  }

  rebanna.run(command[0], flags);
}

runRebanna(cli.input, cli.flags);
