[@composer-js/cli](../README.md) › [Globals](../globals.md) › [NodejsServerGenerator](nodejsservergenerator.md)

# Class: NodejsServerGenerator

Code generator for NodeJS Server projects.

## Hierarchy

* [BaseGenerator](basegenerator.md)

  ↳ **NodejsServerGenerator**

## Implements

* [Generator](../interfaces/generator.md)

## Index

### Constructors

* [constructor](nodejsservergenerator.md#constructor)

### Accessors

* [language](nodejsservergenerator.md#language)
* [type](nodejsservergenerator.md#type)

### Methods

* [convertDataType](nodejsservergenerator.md#protected-convertdatatype)
* [createGlobalVars](nodejsservergenerator.md#protected-createglobalvars)
* [generate](nodejsservergenerator.md#generate)
* [generateRoutes](nodejsservergenerator.md#protected-generateroutes)
* [generateSchemaMembers](nodejsservergenerator.md#protected-generateschemamembers)
* [generateSchemas](nodejsservergenerator.md#protected-generateschemas)
* [getDefaultValue](nodejsservergenerator.md#protected-getdefaultvalue)
* [getExampleValue](nodejsservergenerator.md#protected-getexamplevalue)
* [getSchemaDependencies](nodejsservergenerator.md#protected-getschemadependencies)
* [init](nodejsservergenerator.md#init)
* [processDirectory](nodejsservergenerator.md#protected-processdirectory)
* [processFile](nodejsservergenerator.md#protected-processfile)
* [processTemplate](nodejsservergenerator.md#protected-processtemplate)

## Constructors

###  constructor

\+ **new NodejsServerGenerator**(`logger`: any): *[NodejsServerGenerator](nodejsservergenerator.md)*

*Overrides [BaseGenerator](basegenerator.md).[constructor](basegenerator.md#constructor)*

Defined in generators/NodejsServerGenerator.ts:10

**Parameters:**

Name | Type |
------ | ------ |
`logger` | any |

**Returns:** *[NodejsServerGenerator](nodejsservergenerator.md)*

## Accessors

###  language

• **get language**(): *string*

*Overrides [BaseGenerator](basegenerator.md).[language](basegenerator.md#language)*

Defined in generators/NodejsServerGenerator.ts:15

**Returns:** *string*

___

###  type

• **get type**(): *string*

*Overrides [BaseGenerator](basegenerator.md).[type](basegenerator.md#type)*

Defined in generators/NodejsServerGenerator.ts:19

**Returns:** *string*

## Methods

### `Protected` convertDataType

▸ **convertDataType**(`type`: string, `format`: string, `name`: string): *string | undefined*

*Overrides [BaseGenerator](basegenerator.md).[convertDataType](basegenerator.md#protected-abstract-convertdatatype)*

Defined in generators/NodejsServerGenerator.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`format` | string |
`name` | string |

**Returns:** *string | undefined*

___

### `Protected` createGlobalVars

▸ **createGlobalVars**(`spec`: any): *void*

*Inherited from [BaseGenerator](basegenerator.md).[createGlobalVars](basegenerator.md#protected-createglobalvars)*

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

*Inherited from [BaseGenerator](basegenerator.md).[generate](basegenerator.md#generate)*

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

*Inherited from [BaseGenerator](basegenerator.md).[generateRoutes](basegenerator.md#protected-generateroutes)*

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

*Inherited from [BaseGenerator](basegenerator.md).[generateSchemaMembers](basegenerator.md#protected-generateschemamembers)*

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

*Inherited from [BaseGenerator](basegenerator.md).[generateSchemas](basegenerator.md#protected-generateschemas)*

Defined in BaseGenerator.ts:300

Generates a list of template variable definitions for each schema in the given OpenAPI specification.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`spec` | any | The OpenAPI specification to generate schemas for.  |

**Returns:** *any[]*

___

### `Protected` getDefaultValue

▸ **getDefaultValue**(`type`: any, `format`: string, `subtype?`: any): *any*

*Overrides [BaseGenerator](basegenerator.md).[getDefaultValue](basegenerator.md#protected-abstract-getdefaultvalue)*

Defined in generators/NodejsServerGenerator.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`type` | any |
`format` | string |
`subtype?` | any |

**Returns:** *any*

___

### `Protected` getExampleValue

▸ **getExampleValue**(`type`: any, `format`: string, `subtype?`: any): *any*

*Overrides [BaseGenerator](basegenerator.md).[getExampleValue](basegenerator.md#protected-abstract-getexamplevalue)*

Defined in generators/NodejsServerGenerator.ts:105

**Parameters:**

Name | Type |
------ | ------ |
`type` | any |
`format` | string |
`subtype?` | any |

**Returns:** *any*

___

### `Protected` getSchemaDependencies

▸ **getSchemaDependencies**(`spec`: any, `schemaName`: string, `bIncludeSelf`: boolean): *string[]*

*Inherited from [BaseGenerator](basegenerator.md).[getSchemaDependencies](basegenerator.md#protected-getschemadependencies)*

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

*Inherited from [BaseGenerator](basegenerator.md).[init](basegenerator.md#init)*

Defined in BaseGenerator.ts:27

**Returns:** *void*

___

### `Protected` processDirectory

▸ **processDirectory**(`srcPath`: string, `destPath`: string, `vars`: any): *Promise‹void›*

*Inherited from [BaseGenerator](basegenerator.md).[processDirectory](basegenerator.md#protected-processdirectory)*

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

*Inherited from [BaseGenerator](basegenerator.md).[processFile](basegenerator.md#protected-processfile)*

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

*Inherited from [BaseGenerator](basegenerator.md).[processTemplate](basegenerator.md#protected-processtemplate)*

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
