# Rebanna

Rebanna is build to easily create a webfont with support of stacked icons. Inline SVG (sprites) are not always the best option, iconfonts are widley supported

## Getting started

### Prerequisites

*Rebanna* can be installed through `npm`. When you install [Node.js](https://nodejs.org/), the package manager will also be installed.

### Installing

To install *rebanna*, run the following on the command line:

```
npm install rebanna
```

## Usage

### Configuration

Configuration can be done by command-line arguments, environment variables or through a `.rebanna.js`-file (usage in-order).

#### `.rebanna.js` example

```javascript
module.exports = {
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
}
```

### Running

Creating a webfont from SVG's with *rebanna* typically follows these steps:

1. Store the [correctly formated SVG's](docs/format-svg.md) in the *icons* folder.
2. Run `npm start` on the command line to generate your webfont and CSS.

## About

Ever thought about the correct name for a multi-layered-svgs-to-stacked-icons-from-a-webfont tool? I have, it's terrible, believe me. Therefore I just named it after a very special person who often makes me a stack of super fluffy banana pancakes :)

## Contribution

Feel free to push your code if you agree with publishing under the MIT license.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for changes per version.

## License

Copyright © 2018 Maarten Brakkee <maarten@zeroten.nl>. The license can be found in the [LICENSE](LICENSE) file.
