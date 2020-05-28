[@composer-js/cli](README.md) › [Globals](globals.md)

# @composer-js/cli

## Index

### Classes

* [BaseGenerator](classes/basegenerator.md)
* [NodejsServerGenerator](classes/nodejsservergenerator.md)

### Interfaces

* [Generator](interfaces/generator.md)

### Variables

* [StringUtils](globals.md#stringutils)
* [cliOptions](globals.md#const-clioptions)
* [logger](globals.md#const-logger)
* [packageInfo](globals.md#const-packageinfo)

### Functions

* [printHelp](globals.md#const-printhelp)
* [printVersion](globals.md#const-printversion)
* [processcommandLine](globals.md#const-processcommandline)

## Variables

###  StringUtils

• **StringUtils**: *any*

Defined in generators/CppClientGenerator.ts:4

Defined in generators/CsharpClientGenerator.ts:4

Defined in generators/TypescriptClientGenerator.ts:4

___

### `Const` cliOptions

• **cliOptions**: *CommandLineOptions* = commandLineArgs([
    { name: "input", alias: "i", type: String, multiple: true },
    { name: "output", alias: "o", type: String },
    { name: "language", alias: "l", type: String },
    { name: "type", alias: "t", type: String },
    { name: "add", alias: "a", type: String, multiple: true },
    { name: "version", alias: "v", type: Boolean },
    { name: "help", alias: "h", type: Boolean }
])

Defined in cli.ts:41

___

### `Const` logger

• **logger**: *any* = Logger(cliOptions["verbose"] ? "debug" : "info")

Defined in cli.ts:51

___

### `Const` packageInfo

• **packageInfo**: *any* = require("../package.json")

Defined in cli.ts:11

## Functions

### `Const` printHelp

▸ **printHelp**(`langs`: string[], `types`: string[]): *void*

Defined in cli.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`langs` | string[] |
`types` | string[] |

**Returns:** *void*

___

### `Const` printVersion

▸ **printVersion**(): *void*

Defined in cli.ts:34

**Returns:** *void*

___

### `Const` processcommandLine

▸ **processcommandLine**(): *Promise‹void›*

Defined in cli.ts:52

**Returns:** *Promise‹void›*
