# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2019-08-17
- Add "types": "dist/index.d.ts" in package.json

## [1.0.0] - 2019-08-17
### Changed
- Updated dependencies
- Generate declaration files
- 1.x.x release, as it's been used in production for a while

## [0.2.4] - 2018-12-13
### Changed
- Updated package-lock.json to fix a potential vulnerability due to the merge dependency
- Add ecdhCurve: 'auto' in the agent options to fix a bug in Node 8 (https://github.com/nodejs/node/issues/19359)

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
