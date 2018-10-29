# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.3] - 2018-10-29
### Changed
- Remove comments from dist files
- Throw HTTPError (instead of regular error) with null res if fetch throws an exception

## [0.2.2] - 2018-10-26
### Added
- dist generation in prepack and pretest script
- .npmignore to remove source files
- keywords and engines to package.json

### Changed
- Regenerate jwksclient.js to what version 0.2.0 was supposed to be

## [0.2.1] - 2018-10-26 (BROKEN)
### Changed
- Version 0.2.0 was broken in the npm registry. Bump patch version to publish in npm. Code is identical to version 0.2.0

## [0.2.0] - 2018-10-26 (BROKEN)
### Changed
- If an invalid kid is provided and the JWKs only contains one key throw an error instead of returning the sole key

## [0.1.0] - 2018-10-25
### Added
- First version
