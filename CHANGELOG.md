# Changelog
All notable changes to this project will be documented in this file.

## [0.5.2-0.5.3] - 2019-02-11
### Fixed
- Fixed SVGO command line call.
- Updated dependencies.

## [0.5.1] - 2018-08-13
### Fixed
- Fix naming in templates.

## [0.5.0] - 2018-08-10
### Added
- `fontTemplatePath` option, for correct font path in exported templates.
- `clean` command is not run default on build. Option `--clean` added to overrule this.

### Fixed
- Correct `fontTemplatePath` variables in templates (except for HTML, which is a demo file).
- Fix font name in templates.
- Various text fixes in README and CHANGELOG.

## [0.4.3-0.4.4] - 2018-08-07
### Fixed
- Don't print debug information to console.

## [0.4.1-0.4.2] - 2018-08-06
### Added
- HTML template shows alert on click (with highlighted code for copy to clipboard).

### Fixed
- Multiple templates format array was sliced too much.

## [0.4.0] - 2018-08-06
### Added
- Multiple templates functionality added.

### Fixed
- Fix command line arguments overwrite.

## [0.3.2-0.3.4] - 2018-08-03
### Fixed
- Fix paths for config files when installed as module.
- Improved generated HTML.
- Update README.

## [0.3.1] - 2018-08-02
### Added
- Color change example gif added.

### Fixed
- Input SVG filenames can now have `-`, as automatic group splitting is done with `___` now.

## [0.3.0] - 2018-08-02
### Added
- `--watch` option added.

## [0.2.0] - 2018-08-01
### Added
- `async`, `chalk` and `meow` modules for added CLI functionality.
- `cli.js` and `index.js` have been added in favor of seperate files.
- After installing rebanna as a module it can be used like `rebanna [command] [options]`

### Fixed
- Exit script when no top-level groups are found inside SVG.
- Exit script when top-level groups are not groups.

### Removed
- `clean.js`, `create-tmp-folder.js`, `nconf.js`, `split-svg.js`, `svgo.js` and `webfont.js` are removed in favor of `cli.js` and `index.js`.
- `nconf` module, as it is not needed anymore

## [0.1.0] - 2018-06-04
### Added
- Init first version.
