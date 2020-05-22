# AcceleratXR Generator

A command line utility that generates code or documentation from an OpenAPI specification.

## Supported Languages & Platforms

This tool can generate client, server projects and documentation for the following list of languages and platforms.

| Language            | Type   | Description                         |
| ------------------- | ------ | ----------------------------------- |
| C++                 | Client | C++ SDK library                     |
| C#                  | Client | C# SDK library                      |
| JavaScript / NodeJS | Server | Standalone NodeJS server            |
| Markdown            | Client | SDK API Documentation               |
| Markdown            | Server | OpenAPI Specification Documentation |

# Usage

```
Usage: axr-generator -i <input> -o <output> -l <language> -t <type>

                -i --input      The input OpenAPI specification file to generate from.
                                Accepts JSON or YAML formatted files. Specify this option multiple times to merge files.
                -o --output     The destination path to write all files to.
                -l --language   The desired output language to generate.
                                Supported Languages:
                                        cpp
                                        unreal
                                        nodejs
                                        markdown
                -t --type       The type of files to generate.
                                Supported Types:
                                        client
                                        server
```
