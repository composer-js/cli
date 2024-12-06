///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { StringUtils } from "@composer-js/core";
import BaseGenerator from "../BaseGenerator";
import * as path from "path";

/**
 * Code generator for NodeJS Server projects.
 */
export default class NodejsServer extends BaseGenerator {
    constructor(logger: any) {
        super(logger);
    }

    public get templatePath(): string {
        return path.resolve(path.join(__dirname, "..", "..", "templates", "nodejs", "server"));
    }

    protected convertDataType(type: string, format: string, name: string): string | undefined {
        let result: string | undefined = undefined;

        switch (type) {
            case "array": {
                result = "Array<" + format + ">";
                break;
            }
            case "boolean": {
                result = "boolean";
                break;
            }
            case "integer": {
                result = "number";
                break;
            }
            case "number": {
                result = "number";
                break;
            }
            case "object": {
                result = name ? StringUtils.toPascalCase(name) : "any";
                break;
            }
            case "string": {
                if (format) {
                    switch (format) {
                        case "binary": {
                            result = "Buffer";
                            break;
                        }
                        case "date":
                        case "date-time": {
                            result = "Date";
                            break;
                        }
                        default: {
                            result = "string";
                            break;
                        }
                    }
                } else {
                    result = "string";
                    break;
                }
            }
        }

        return result;
    }

    protected getDefaultValue(type: any, format: string, subtype?: any): any {
        let result: any = "";

        if (type.match("Array.*")) {
            result = "[]";
        }
        else if (type.match("boolean")) {
            result = false;
        }
        else if (type.match("Buffer")) {
            result = "new Buffer()";
        }
        else if (type.match("Date")) {
            result = "new Date()";
        }
        else if (type.match("number")) {
            result = 0;
        }
        else if (type.match("string")) {
            result = '""';
        }
        else if (type.match("any")) {
            result = "undefined";
        }
        else {
            result = `new ${StringUtils.toPascalCase(type)}()`;
        }

        return result;
    }

    protected getExampleValue(type: any, format: string, subtype?: any): any {
        return undefined;
    }
};