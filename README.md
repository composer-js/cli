# Composer
[![pipeline status](https://gitlab.com/AcceleratXR/composerjs/cli/badges/master/pipeline.svg)](https://gitlab.com/AcceleratXR/composerjs/cli/-/commits/master)
[![coverage report](https://gitlab.com/AcceleratXR/composerjs/cli/badges/master/coverage.svg)](https://gitlab.com/AcceleratXR/composerjs/cli/-/commits/master)

A command line utility that generates Composer based projects from an OpenAPI specification.

## Supported Languages & Platforms

This tool can generate client and server projects for the following list of languages and platforms.

| Language / Platform | Type     | Description                         |
| ------------------- | ------   | ----------------------------------- |
| `cpp` (C++)         | `client` | C++ SDK library                     |
| `csharp` (C#)       | `client` | C# SDK library                      |
| `typescript`        | `client` | TypeScript/JavaScript SDK library   |
| `nodejs`            | `server` | Standalone NodeJS server            |

# Usage

```
Usage: composer -i <input> -o <output> -l <language> -t <type>

                -i --input      The input OpenAPI specification file to generate from.
                                Accepts JSON or YAML formatted files. Specify this option multiple times to merge files.
                -o --output     The destination path to write all files to.
                -l --language   The desired output language to generate.
                                Supported Languages:
                                        cpp
                                        csharp
                                        nodejs
                                        typescript
                -t --type       The type of project to generate.
                                Supported Types:
                                        client
                                        server
```
