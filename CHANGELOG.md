# Changelog
All notable changes to this project will be documented in this file.

## [0.2.0] - 2018-08-01
### Added
- `async`, `chalk` and `meow` modules for added CLI functionality.
- `cli.js` and `index.js` have been added in favor of seperate files.
- After installing rebanna as a module it can be used like `rebanna [command] [options]`

### Fixed
- Exit script when no top level groups are found inside SVG.
- Exit script when top level groups are not groups.

### Removed
- `clean.js`, `create-tmp-folder.js`, `nconf.js`, `split-svg.js`, `svgo.js` and `webfont.js` are removed in favor of `cli.js` and `index.js`.
- `nconf` module, as it is not needed anymore

## [0.1.0] - 2018-06-04
### Added
- Init first version.
