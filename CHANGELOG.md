# Changelog
All notable changes to this project will be documented in this file.

## [0.5.8] - 2020-04-09
### Added
- `babel.config.js` added (Babel upgrade).
- `package-lock.json` added.

### Changed
- Line endings are now LF (ESlint setting).
- Updated Babel to 7.x.
- Updated ESlint to 6.8.0.
- Updated async to 3.2.0.
- Updated chalk to 3.0.0.
- Updated meow to 6.1.0.
- Updated nunjucks to 3.2.1.
- Updated rimraf to 3.0.2.
- Updated svgo to 1.3.2.
- Updated webfont to 9.0.0.
- Updated xml2js to 0.4.23.

### Removed
- `.babelrc` removed (Babel upgrade).

## [0.5.7] - 2019-07-15
### Fixed
- Force versions for dependencies, as SVGO update did break the build process.

## [0.5.5-0.5.6] - 2019-05-21
### Fixed
- Fix npm vulnerability.

## [0.5.2-0.5.4] - 2019-02-11
### Fixed
- Fixed SVGO command line call.
- Updated dependencies.
- Revert fix SVGO command line call (not needed, reinstall will do).

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
