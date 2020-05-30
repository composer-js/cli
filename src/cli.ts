//#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import * as commandLineArgs from "command-line-args";
import { ClassLoader, Logger, OASUtils } from "@composer-js/core";
import Generator from "./Generator";
import * as path from "path";
import * as shelljs from "shelljs";
import * as merge from "deepmerge";
const packageInfo = require("../package.json");

const printHelp = function(langs: string[], types: string[]) {
    console.log("Usage: composer -i <input> -o <output> -l <language> -t <type>");
    console.log("");
    console.log("\t\t-i --input\tThe input OpenAPI specification file to generate from.");
    console.log("\t\t\t\tAccepts JSON or YAML formatted files. Specify this option multiple times to merge files.");
    console.log("\t\t-o --output\tThe destination path to write all files to.");
    console.log("\t\t-l --language\tThe desired output language to generate.");
    console.log("\t\t-a --add\tThe path to one or more additional files to be include.");
    console.log("\t\t-v --version\tDisplays the release version of the tool.");
    console.log("\t\t-h --help\tDisplays this help menu.");
    console.log("\t\t\t\tSupported Languages:");
    for (const lang of langs) {
        console.log("\t\t\t\t\t" + lang);
    }
    console.log("\t\t-t --type\tThe type of files to generate.");
    console.log("\t\t\t\tSupported Types:");
    for (const type of types) {
        console.log("\t\t\t\t\t" + type);
    }
};

const printVersion = function() {
    console.log("ComposerJS: Compose great software.");
    console.log("Version: " + packageInfo.version);
    console.log("Copyright (C) 2020 AcceleratXR, Inc. All rights reserved.");
};

// Parse the CLI options
const cliOptions = commandLineArgs([
    { name: "input", alias: "i", type: String, multiple: true },
    { name: "output", alias: "o", type: String },
    { name: "language", alias: "l", type: String },
    { name: "type", alias: "t", type: String },
    { name: "add", alias: "a", type: String, multiple: true },
    { name: "version", alias: "v", type: Boolean },
    { name: "help", alias: "h", type: Boolean }
]);

const logger = Logger(cliOptions["verbose"] ? "debug" : "info");
const processcommandLine = async () =>{
    try {
        const pwd: string = shelljs.pwd().toString();

        if (cliOptions["version"]) {
            printVersion();
            process.exit(0);
        }

        // Load all available generator classes
        const cl: ClassLoader = new ClassLoader(path.join(__dirname, "./generators"));
        await cl.Load();

        // Build a map of all generator language => type => generator
        const genMap: any = {};
        const langs: string[] = [];
        const types: string[] = [];
        for (const pair of cl.GetClasses()) {
            const clazz: any = pair[1];
            const gen: Generator = new clazz(logger);

            // Add to the list of supported languages
            if (!langs.includes(gen.language)) {
                langs.push(gen.language);
            }

            // Add to the list of supported app types
            if (!types.includes(gen.type)) {
                types.push(gen.type);
            }

            // Add to the generator map
            if (!genMap[gen.language]) {
                genMap[gen.language] = {};
            }
            genMap[gen.language][gen.type] = gen;
        }

        if (cliOptions["help"]) {
            printHelp(langs, types);
            process.exit(0);
        }
    
        // Make sure all required options have been set.
        if (!cliOptions["input"]) {
            console.error("Error: No input file specified.");
            printHelp(langs, types);
            process.exit(1);
        }
        if (!cliOptions["output"]) {
            console.error("Error: No output directory specified.");
            printHelp(langs, types);
            process.exit(1);
        }
        if (!cliOptions["language"]) {
            console.error("Error: No language specified.");
            printHelp(langs, types);
            process.exit(1);
        }
        if (!cliOptions["type"]) {
            console.error("Error: No type specified.");
            printHelp(langs, types);
            process.exit(1);
        }
    
        // Validate the selected language
        if (!langs.includes(cliOptions["language"])) {
            console.error("Error: Unsupported language specified: " + cliOptions["language"]);
            console.log("");
            console.log("Supported Languages:");
            for (let lang in langs) {
                console.log("\t" + lang);
            }
            process.exit(1);
        }
    
        // Validate the selected type
        if (!types.includes(cliOptions["type"])) {
            console.error("Error: Unsupported type specified: " + cliOptions["type"]);
            console.log("");
            console.log("Supported Types:");
            for (let type in types) {
                console.log("\t" + type);
            }
            process.exit(1);
        }
    
        // Load all OpenAPI specifications into one document
        let apiSpec = {};
        for (const spec of cliOptions["input"]) {
            try {
                const specPath: string = path.resolve(path.join(pwd, spec));
                apiSpec = merge(await OASUtils.loadSpec(specPath), apiSpec);
            } catch (err) {
                console.error("File is an invalid or malformed OpenAPI specification file: " + spec);
                console.error(err);
                process.exit(1);
            }
        }

        // Run the desired generator
        const generator: Generator = genMap[cliOptions["language"]][cliOptions["type"]];
        generator.init();
        await generator.generate(apiSpec, path.resolve(path.join(pwd, cliOptions["output"])), cliOptions["add"]);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

processcommandLine();