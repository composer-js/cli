///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import Generator from "./Generator";
import handlebars from "handlebars";
import { FileUtils, OASUtils, StringUtils } from "@composer-js/core";
import * as fs from "fs";
import * as path from "path";
import { isText } from "istextorbinary";
import * as shelljs from "shelljs";

/**
 * Defines a base abstract code generator including common code generation functionality common to all generators.
 */
abstract class BaseGenerator implements Generator {
    private logger: any;
    private IgnoreFiles: Array<string> = [];
    private TemplatePath: string = "";

    constructor(logger: any) {
        this.logger = logger;
    }

    public abstract get templatePath(): string;

    public init(): void {
        handlebars.registerHelper(require('handlebars-helpers')());
        
        this.TemplatePath = path.resolve(this.templatePath);
        
        if (!fs.existsSync(this.TemplatePath)) {
            throw new Error("No template files exist at path: " + this.TemplatePath);
        }
    }

    /**
     * 
     * @param type 
     * @param format 
     * @param name 
     */
    protected abstract convertDataType(type: string, format: string, name: string): string | undefined;

    /**
     * Generates a map of global template variable names to values that will be swapped upon file generation.
     */
    protected createGlobalVars(spec: any): void {
        const result: any = Object.assign({
            datastores: {},
            info: {}
        }, spec);

        const now: Date = new Date();
        result.info.author = shelljs.env["author"] ? shelljs.env["author"] : "<AUTHOR>";
        result.info.copyright = shelljs.env["copyright"] ? shelljs.env["copyright"] : "<COPYRIGHT>";
        result.info.name = spec?.info?.title.toLowerCase().replace(new RegExp(/ /, "gi"), "_") || "new_project";
        result.info.repository = shelljs.env["repository"] ? shelljs.env["repository"] : "<REPOSITORY>";
        result.timestamp = now.toISOString();
        result.day = now.getDay();
        result.month = now.getMonth();
        result.year = now.getFullYear();

        if (spec?.components?.schemas) {
            for (const schemaName in spec.components.schemas) {
                const schema = spec.components.schemas[schemaName];
                if (schema["x-datastore"]) {
                    const name = schema["x-datastore"];
                    const def = OASUtils.getDatastore(spec, name);
                    if (def) {
                        result.datastores[name] = def;
                    }
                }
            }
        }

        return result;
    };

    /**
     * Returns a default value for a given data type.
     *
     * @param {any} type The data type to return a default value for.
     * @param {string} format The format of the type's data.
     * @param {any | undefined} subtype The sub-type of the data. (e.g. the container value)
     * @return The default value for the specified type.
     */
    protected abstract getDefaultValue(type: any, format: string, subtype?: any): any;

    /**
     * Returns an example value for a given data type.
     *
     * @param {any} type The data type to return a example value for.
     * @param {string} format The format of the type's data.
     * @param {any | undefined} subtype The sub-type of the data. (e.g. the container value)
     * @return The example value for the specified type.
     */
    protected abstract getExampleValue(type: any, format: string, subtype?: any): any;

    /**
     * Generates a list of template variable definitions for each route defined in the given OpenAPI spec.
     * 
     * @param spec The OpenAPI spec to generate routes from.
     */
    protected generateRoutes(spec: any): any[] {
        const result: any = {};

        if (spec?.paths) {
            // Go through each path definition in the spec and generate a template info block for each endpoint
            for (let path in spec.paths) {
                const def = spec.paths[path];
                const schemaName = def["x-schema"] ? def["x-schema"] : undefined;
                const name = def["x-name"] && def["x-name"] !== "_a" ? def["x-name"] : schemaName ? schemaName : "Global";

                // Create the initial object that will contain all route info
                if (!result[name]) {
                    result[name] = {
                        endpoint: path,
                        hasModel: schemaName !== undefined,
                        Route: StringUtils.toPascalCase(name),
                        route: StringUtils.toCamelCase(name),
                        ROUTE: name.toLocaleUpperCase(),
                        routes: [],
                        methods: [],
                        dependencies: []
                    };
                    if (schemaName) {
                        result[name].Schema = StringUtils.toPascalCase(schemaName);
                        result[name].schema = StringUtils.toCamelCase(schemaName);
                 
                        result[name].SCHEMA = schemaName.toLocaleUpperCase();
                        result[name].properties = this.generateSchemaProperties(spec, schemaName);
                    }
                }

                // Extract the parameters from the path (if any exist)
                const params = path.match(new RegExp("(?<=\\{).*?(?=\\})", "gi"));

                // Go through each operation
                for (let method in def) {
                    if (method === "parameters" || method.includes("x-")) {
                        continue;
                    }

                    const route = def[method];

                    // If 'x-upgrade' is set then the method is overridden to WebSocket.
                    if (route["x-upgrade"])
                    {
                        method = "WebSocket";
                    }

                    // Add the method to our global list
                    const Method: string = StringUtils.toPascalCase(method);
                    if (!result[name].methods.includes(Method)) {
                        result[name].methods.push(Method);
                    }

                    // Convert the path to a relative path and swap the params to be Express compatible
                    const subpath = path
                        .replace(result[name].endpoint, "")
                        .replace("{", ":")
                        .replace("}", "");

                    // Extract the request data type (if present)
                    const requestTypeInfo =
                        route.requestBody && route.requestBody.content && route.requestBody.content["application/json"]
                            ? OASUtils.getTypeInfo(route.requestBody.content["application/json"].schema, spec, this.convertDataType)
                            : undefined;

                    // Extract the response data type (if present)
                    const response = OASUtils.getResponseContent(route);
                    const responseTypeInfo =
                        response && response["application/json"]
                            ? OASUtils.getTypeInfo(response["application/json"].schema, spec, this.convertDataType)
                            : undefined;

                    // Convert the security block to a list of strategy names
                    let security: any[] | undefined = undefined;
                    if (route.security) {
                        security = [];
                        for (let key in route.security) {
                            for (let strategy in route.security[key]) {
                                security.push(strategy);
                            }
                        }
                    }

                    result[name].routes.push({
                        after: JSON.stringify(route["x-after"]),
                        before: JSON.stringify(route["x-before"]),
                        description: route.description,
                        hasQuery: route.parameters !== undefined,
                        method: StringUtils.toCamelCase(method),
                        Method: StringUtils.toPascalCase(method),
                        METHOD: method.toUpperCase(),
                        name: route["x-name"] ? StringUtils.toCamelCase(route["x-name"]) : undefined,
                        Name: route["x-name"] ? StringUtils.toPascalCase(route["x-name"]) : undefined,
                        NAME: route["x-name"] ? route["x-name"].toUpperCase() : undefined,
                        params,
                        path: subpath,
                        requestType: requestTypeInfo ? requestTypeInfo.type : undefined,
                        responseType: responseTypeInfo && responseTypeInfo.type ? responseTypeInfo.type : undefined,
                        security: JSON.stringify(security)
                    });

                    if (requestTypeInfo) {
                        const type = requestTypeInfo.subType ? requestTypeInfo.subType : requestTypeInfo.type;
                        const deps: string[] = this.getSchemaDependencies(spec, type, true);
                        for (const dep of deps) {
                            if (!result[name].dependencies.includes(dep)) {
                                result[name].dependencies.push(dep);
                            }
                        }
                    }
                    if (responseTypeInfo) {
                        const type = responseTypeInfo.subType ? responseTypeInfo.subType : responseTypeInfo.type;
                        const deps: string[] = this.getSchemaDependencies(spec, type, true);
                        for (const dep of deps) {
                            if (!result[name].dependencies.includes(dep)) {
                                result[name].dependencies.push(dep);
                            }
                        }
                    }
                }
            }
        }

        return result;
    }

    /**
     * Generates a list of template variable definitions for each property of the schema with the specified name.
     * 
     * @param {object} spec The OpenAPI specification to reference.
     * @param {string} schemaName The name of the schema to generate properties from.
     * @returns {any[]} A list of all properties and their associated template replacement values.
     */
    protected generateSchemaProperties(spec: any, schemaName: string): any[] {
        const result: any[] = [];

        const schema: any = OASUtils.getSchema(spec, schemaName);
        if (schema) {
            const baseClass: string = StringUtils.toPascalCase(schema["x-baseClass"] ? schema["x-baseClass"] : "None");

            for (const memberName in schema.properties) {
                const memberDef: any = schema.properties[memberName];

                // Skip built-in `BaseEntity` members
                if (baseClass !== "None" && memberName.match(new RegExp(/^uid$/))) {
                    continue;
                }
                if (baseClass.includes("Base") && memberName.match(new RegExp(/^dateCreated$/))) {
                    continue;
                }
                if (baseClass.includes("Base") && memberName.match(new RegExp(/^dateModified$/))) {
                    continue;
                }
                if (baseClass.includes("Base") && memberName.match(new RegExp(/^version$/))) {
                    continue;
                }

                // Is the member a regular type, an array or a reference?
                const typeInfo = OASUtils.getTypeInfo(memberDef, spec, this.convertDataType);

                if (typeInfo) {
                    memberDef.defaultValue = memberDef.default ? memberDef.default : this.getDefaultValue(typeInfo.type, typeInfo.format, typeInfo.subType);
                    memberDef.exampleValue = memberDef.example ? memberDef.example : this.getExampleValue(typeInfo.type, typeInfo.format, typeInfo.subType);
                    memberDef.Name = StringUtils.toPascalCase(memberName);
                    memberDef.name = StringUtils.toCamelCase(memberName);
                    memberDef.NAME = memberName.toLocaleUpperCase();

                    const subSchemaName = typeInfo.subSchemaRef ? path.basename(typeInfo.subSchemaRef) : null;
                    if (subSchemaName) {
                        memberDef.subSchema = StringUtils.toCamelCase(subSchemaName);
                        memberDef.SubSchema = StringUtils.toPascalCase(subSchemaName);
                        memberDef.SUBSCHEMA = subSchemaName.toLocaleUpperCase();
                    }

                    result.push(memberDef);
                } else {
                    throw new Error("Unable to convert type: schema:" + schemaName + ", property:" + memberName);
                }
            }
        } else {
            throw new Error("Schema not found: " + schemaName);
        }

        return result;
    };

    /**
     * Generates a list of template variable definitions for each schema in the given OpenAPI specification.
     * @param spec The OpenAPI specification to generate schemas for.
     */
    protected generateSchemas(spec: any) {
        const result: any = Object.assign({
        }, spec?.components?.schemas);

        for (const schemaName in result) {
            const schema = result[schemaName];
            schema.Schema = StringUtils.toPascalCase(schemaName);
            schema.schema = StringUtils.toCamelCase(schemaName);
            schema.SCHEMA = schemaName.toLocaleUpperCase();
            schema.properties = this.generateSchemaProperties(spec, schemaName);
            schema.dependencies = this.getSchemaDependencies(spec, schemaName);
        }

        return result;
    }

    /**
     * Returns a list of all dependencies for a given schema.
     * @param spec The OpenAPI specification to parse.
     * @param schemaName The name of the schema to retrieve dependencies for.
     * @param bIncludeSelf Set to `true` to include the given schema in the list if valid, otherwise `false`.
     * @returns A list of all dependencies for the schema with the given name.
     */
    protected getSchemaDependencies(spec: any, schemaName: string, bIncludeSelf: boolean = false): string[] {
        let result: string[] = [];
        
        let schema: any = OASUtils.getSchema(spec, schemaName);
        if (schema) {
            // Add our self to the list
            if (bIncludeSelf) {
                result.push(schemaName);
            }

            // Go through each property in the schema, looking for other schemas
            for (const propName in schema.properties) {
                const prop: any = schema.properties[propName];

                let ref: string | undefined = undefined;
                if (prop["$ref"]) {
                    ref = prop["$ref"];
                }
                else if (prop.items && prop.items["$ref"]) {
                    ref = prop.items["$ref"];
                }

                if (ref) {
                    // Strip out the primary name of the dependency schema
                    const slashIdx: number = ref.lastIndexOf("/");
                    ref = slashIdx >= 0 ? ref.substring(slashIdx + 1) : ref;

                    // Don't add duplicates to the list
                    if (!result.includes(ref)) {
                        result.push(ref);
                    }

                    // Add all of the schema's sub-dependencies
                    result = result.concat(this.getSchemaDependencies(spec, ref));
                }
            }
        }

        return result;
    }

    /**
     * Processes a single file for code generation or copying.
     * 
     * @param srcPath The path to the source file to process.
     * @param destPath The path to write the processed file contents to.
     * @param vars The template variables to use during file processing.
     */
    protected async processFile(srcPath: string, destPath: string, vars: any): Promise<void> {
        const srcName: string = path.basename(srcPath);

        // Is the file binary or text?
        if (isText(srcPath)) {
            // Determine if the src file is a schema or route template. If so we'll want to iterate
            // through each schemas/routes for the file.
            if (srcName.match(new RegExp(/.*\{\{schema\}\}.*/, 'i'))) {
                if (vars.components?.schemas) {
                    for (const key in vars.components.schemas) {
                        const schema = vars.components.schemas[key];

                        // When the schema has the x-ignore flag we don't generate code for it.
                        if (schema["x-ignore"]) {
                            continue;
                        }
                        
                        const finalVars: any = Object.assign({}, vars, schema);
                        await this.processTemplate(srcPath, destPath, finalVars);
                    }
                }
            }
            else if (srcName.match(new RegExp(/.*\{\{route\}\}.*/, 'i'))) {
                if (vars.routes) {
                    for (const key in vars.routes) {
                        const route = vars.routes[key];
                        const finalVars: any = Object.assign({}, vars, route);
                        await this.processTemplate(srcPath, destPath, finalVars);
                    }
                }
            }
            else {
                await this.processTemplate(srcPath, destPath, vars);
            }
        }
        else {
            await FileUtils.copyBinaryFile(srcPath, destPath, vars);
        }
    }

    /**
     * Processes a directory, iterating through each file in the subtree and either performing code generation or file
     * copying.
     * 
     * @param srcPath The source directory path to process.
     * @param destPath The destination directory to write all contents to.
     * @param vars The template variables to use when processing files.
     */
    protected async processDirectory(srcPath: string, destPath: string, vars: any): Promise<void> {
        // Create the destination directory if it doesn't already exist
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }

        const files: fs.Dirent[] = fs.readdirSync(srcPath, { withFileTypes: true });
        files.forEach(async (file: any) => {
            let extension = path.extname(file.name);
            if (!extension) {
                extension = file.name;
            }
            extension = extension.replace(".", "");
            if (this.IgnoreFiles.indexOf(extension) === -1) {
                let fDestPath = StringUtils.findAndReplace(path.join(destPath, file.name), vars);

                if (file.isDirectory()) {
                    if (!fs.existsSync(fDestPath)) {
                        fs.mkdirSync(fDestPath);
                    }
                    await this.processDirectory(
                        path.join(srcPath, file.name),
                        fDestPath,
                        vars
                    );
                } else {
                    await this.processFile(path.join(srcPath, file.name), fDestPath, vars);
                }
            }
        });
    }

    /**
     * Processes a single template at the given `templatePath` using the specified template variables and
     * writing the result to `destPath`.
     * 
     * @param templatePath The path to the template file to process.
     * @param destPath The path to write the processed file contents to.
     * @param vars The template variables to use during file processing.
     */
    protected async processTemplate(templatePath: string, destPath: string, vars: any): Promise<void> {
        let srcFile: string = fs.readFileSync(templatePath, { encoding: "utf-8" });
        if (srcFile) {
            const finalDestPath: string = StringUtils.findAndReplace(destPath, vars);
            const template: any = handlebars.compile(srcFile);
            
            // Now write the final output to the destination
            let output = template(vars);
            await FileUtils.writeFile(templatePath, finalDestPath, output, true);
        } else {
            throw new Error("Failed to find template: " + templatePath);
        }
    }

    /**
     * Generates all code and files for the given OpenAPI specification writing the contents to the given output path
     * for the configured language and application type. Also copies any files listed in `addtlFiles` to the
     * destination.
     * 
     * @param apiSpec The OpenAPI specification file to generate code for.
     * @param outputPath The output direction to write all generated contents to.
     * @param addtlFiles The list of additional file paths to copy to the destination.
     */
    public async generate(apiSpec: any, outputPath: string, addtlFiles: string[]): Promise<void> {
        // Set a default empty spec if none provided. We'll use the directory name as the title
        apiSpec = apiSpec || {
            components: {
                schemas: {}
            },
            info: {
                title: path.basename(outputPath),
                version: "0.0.1"
            },
            routes: {}
        };

        // First generate all template variables that will be used during code generation
        const vars: any = this.createGlobalVars(apiSpec);
        vars.components.schemas = this.generateSchemas(apiSpec);
        vars.routes = this.generateRoutes(apiSpec);

        // Now go through every file in the template path and begin processing/copying to the destination
        await this.processDirectory(this.TemplatePath, outputPath, vars);

        // Finally copy all additional files to the destination
        // TODO
    }
}

export default BaseGenerator;