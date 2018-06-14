const nconf = require("nconf");
const vm = require("vm");

// Setup nconf to use (in-order):
//  1. Command-line arguments
//  2. Environment variables
//  3. A file located at 'path/to/config.json'
nconf.argv().env().file({
  file: ".rebanna.js",
  // inspired by the work of yoneal on nconf-js https://github.com/yoneal/nconf-js
  format: {
    stringify(obj, replacer, spacing) {
      var space = "", numSpace = (spacing || 2);
      for (var i = 0; i < numSpace; i++) {
        space = space + " ";
      }
      var prefix = "module.exports" + space + "=" + space;
      var jsonStr = JSON.stringify(obj, replacer || null, numSpace);
      return prefix + jsonStr + ";";
    },
    parse(text) {
      var context = { module: { exports: {} } };
      vm.runInNewContext(text, context, {
        lineOffset: 0,
        displayErrors: true
      });
      var result = {};
      for (var key in context.module.exports) {
        result[key] = context.module.exports[key];
      }
      return result;
    }
  }
});

nconf.defaults({
  // the destination for the generated webfont
  "destination": "./font",
  // name for the font
  "fontName": "iconfont",
  // classname prefix for the icons
  "fontClassName": "icon",
  // source folder for the icons
  "iconFolder": "./icons",
  // temporary folder
  "tempFolder": "./.tmp",
  // template for generating html, css or scss
  "template": "./templates/template.html.njk",
});

export function conf(key) {
  return nconf.get(key);
}
