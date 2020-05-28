[@composer-js/cli](../README.md) › [Globals](../globals.md) › [Generator](generator.md)

# Interface: Generator

The `Generator` interface defines a class that can implement code generation for a given OpenAPI specification.

## Hierarchy

* **Generator**

## Implemented by

* [BaseGenerator](../classes/basegenerator.md)
* [NodejsServerGenerator](../classes/nodejsservergenerator.md)

## Index

### Properties

* [language](generator.md#language)
* [type](generator.md#type)

### Methods

* [generate](generator.md#generate)
* [init](generator.md#init)

## Properties

###  language

• **language**: *string*

Defined in Generator.ts:11

Returns the language that the generator will produce.

___

###  type

• **type**: *string*

Defined in Generator.ts:16

Returns the application type (server,client) that the generator will produce.

## Methods

###  generate

▸ **generate**(`apiSpec`: any, `outputPath`: string, `addtlFiles`: string[]): *Promise‹void›*

Defined in Generator.ts:30

Generates all code and files for a given template type and language.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`apiSpec` | any | The OpenAPI specification to generate code from. |
`outputPath` | string | The output directory to write all generated files to. |
`addtlFiles` | string[] | The list of additional files to copy to the destination.  |

**Returns:** *Promise‹void›*

___

###  init

▸ **init**(): *void*

Defined in Generator.ts:21

Initializes the generator with any defaults.

**Returns:** *void*
