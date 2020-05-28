[@composer-js/cli](../README.md) › [Globals](../globals.md) › [BaseGenerator](basegenerator.md)

# Class: BaseGenerator

Defines a base abstract code generator including common code generation functionality common to all generators.

## Hierarchy

* **BaseGenerator**

  ↳ [NodejsServerGenerator](nodejsservergenerator.md)

## Implements

* [Generator](../interfaces/generator.md)

## Index

### Constructors

* [constructor](basegenerator.md#constructor)

### Properties

* [IgnoreFiles](basegenerator.md#private-ignorefiles)
* [TemplatePath](basegenerator.md#private-templatepath)
* [logger](basegenerator.md#private-logger)

### Accessors

* [language](basegenerator.md#language)
* [type](basegenerator.md#type)

### Methods

* [convertDataType](basegenerator.md#protected-abstract-convertdatatype)
* [createGlobalVars](basegenerator.md#protected-createglobalvars)
* [generate](basegenerator.md#generate)
* [generateRoutes](basegenerator.md#protected-generateroutes)
* [generateSchemaMembers](basegenerator.md#protected-generateschemamembers)
* [generateSchemas](basegenerator.md#protected-generateschemas)
* [getDefaultValue](basegenerator.md#protected-abstract-getdefaultvalue)
* [getExampleValue](basegenerator.md#protected-abstract-getexamplevalue)
* [getSchemaDependencies](basegenerator.md#protected-getschemadependencies)
* [init](basegenerator.md#init)
* [processDirectory](basegenerator.md#protected-processdirectory)
* [processFile](basegenerator.md#protected-processfile)
* [processTemplate](basegenerator.md#protected-processtemplate)

## Constructors

###  constructor

\+ **new BaseGenerator**(`logger`: any): *[BaseGenerator](basegenerator.md)*

Defined in BaseGenerator.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`logger` | any |

**Returns:** *[BaseGenerator](basegenerator.md)*

## Properties

### `Private` IgnoreFiles

• **IgnoreFiles**: *Array‹string›* = []

Defined in BaseGenerator.ts:17

___

### `Private` TemplatePath

• **TemplatePath**: *string* = ""

Defined in BaseGenerator.ts:18

___

### `Private` logger

• **logger**: *any*

Defined in BaseGenerator.ts:16

## Accessors

###  language

• **get language**(): *string*

Defined in BaseGenerator.ts:24

**Returns:** *string*

___

###  type

• **get type**(): *string*

Defined in BaseGenerator.ts:25

**Returns:** *string*

## Methods

### `Protected` `Abstract` convertDataType

▸ **convertDataType**(`type`: string, `format`: string, `name`: string): *string | undefined*

Defined in BaseGenerator.ts:43

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string | - |
`format` | string | - |
`name` | string |   |

**Returns:** *string | undefined*

___

### `Protected` createGlobalVars

▸ **createGlobalVars**(`spec`: any): *void*

Defined in BaseGenerator.ts:48

Generates a map of global template variable names to values that will be swapped upon file generation.

**Parameters:**

Name | Type |
------ | ------ |
`spec` | any |

**Returns:** *void*

___

###  generate

▸ **generate**(`apiSpec`: any, `outputPath`: string, `addtlFiles`: string[]): *Promise‹void›*

*Implementation of [Generator](../interfaces/generator.md)*

Defined in BaseGenerator.ts:485

Generates all code and files for the given OpenAPI specification writing the contents to the given output path
for the configured language and application type. Also copies any files listed in `addtlFiles` to the
destination.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`apiSpec` | any | The OpenAPI specification file to generate code for. |
`outputPath` | string | The output direction to write all generated contents to. |
`addtlFiles` | string[] | The list of additional file paths to copy to the destination.  |

**Returns:** *Promise‹void›*

___

### `Protected` generateRoutes

▸ **generateRoutes**(`spec`: any): *any[]*

Defined in BaseGenerator.ts:110

Generates a list of template variable definitions for each route defined in the given OpenAPI spec.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`spec` | any | The OpenAPI spec to generate routes from.  |

**Returns:** *any[]*

___

### `Protected` generateSchemaMembers

▸ **generateSchemaMembers**(`spec`: any, `schemaName`: string): *any[]*

Defined in BaseGenerator.ts:235

Generates a list of template variable definitions for each member of the schema with the specified name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`spec` | any | The OpenAPI specification to reference. |
`schemaName` | string | The name of the schema to generate members from. |

**Returns:** *any[]*

A list of all members and their associated template replacement values.

___

### `Protected` generateSchemas

▸ **generateSchemas**(`spec`: any): *any[]*

Defined in BaseGenerator.ts:300

Generates a list of template variable definitions for each schema in the given OpenAPI specification.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`spec` | any | The OpenAPI specification to generate schemas for.  |

**Returns:** *any[]*

___

### `Protected` `Abstract` getDefaultValue

▸ **getDefaultValue**(`type`: any, `format`: string, `subtype?`: any): *any*

Defined in BaseGenerator.ts:93

Returns a default value for a given data type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | any | The data type to return a default value for. |
`format` | string | The format of the type's data. |
`subtype?` | any | The sub-type of the data. (e.g. the container value) |

**Returns:** *any*

The default value for the specified type.

___

### `Protected` `Abstract` getExampleValue

▸ **getExampleValue**(`type`: any, `format`: string, `subtype?`: any): *any*

Defined in BaseGenerator.ts:103

Returns an example value for a given data type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | any | The data type to return a example value for. |
`format` | string | The format of the type's data. |
`subtype?` | any | The sub-type of the data. (e.g. the container value) |

**Returns:** *any*

The example value for the specified type.

___

### `Protected` getSchemaDependencies

▸ **getSchemaDependencies**(`spec`: any, `schemaName`: string, `bIncludeSelf`: boolean): *string[]*

Defined in BaseGenerator.ts:338

Returns a list of all dependencies for a given schema.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`spec` | any | - | The OpenAPI specification to parse. |
`schemaName` | string | - | The name of the schema to retrieve dependencies for. |
`bIncludeSelf` | boolean | false | Set to `true` to include the given schema in the list if valid, otherwise `false`. |

**Returns:** *string[]*

A list of all dependencies for the schema with the given name.

___

###  init

▸ **init**(): *void*

*Implementation of [Generator](../interfaces/generator.md)*

Defined in BaseGenerator.ts:27

**Returns:** *void*

___

### `Protected` processDirectory

▸ **processDirectory**(`srcPath`: string, `destPath`: string, `vars`: any): *Promise‹void›*

Defined in BaseGenerator.ts:422

Processes a directory, iterating through each file in the subtree and either performing code generation or file
copying.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`srcPath` | string | The source directory path to process. |
`destPath` | string | The destination directory to write all contents to. |
`vars` | any | The template variables to use when processing files.  |

**Returns:** *Promise‹void›*

___

### `Protected` processFile

▸ **processFile**(`srcPath`: string, `destPath`: string, `vars`: any): *Promise‹void›*

Defined in BaseGenerator.ts:386

Processes a single file for code generation or copying.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`srcPath` | string | The path to the source file to process. |
`destPath` | string | The path to write the processed file contents to. |
`vars` | any | The template variables to use during file processing.  |

**Returns:** *Promise‹void›*

___

### `Protected` processTemplate

▸ **processTemplate**(`templatePath`: string, `destPath`: string, `vars`: any): *Promise‹void›*

Defined in BaseGenerator.ts:462

Processes a single template at the given `templatePath` using the specified template variables and
writing the result to `destPath`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`templatePath` | string | The path to the template file to process. |
`destPath` | string | The path to write the processed file contents to. |
`vars` | any | The template variables to use during file processing.  |

**Returns:** *Promise‹void›*
