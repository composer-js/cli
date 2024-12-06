///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import * as commandLineArgs from "command-line-args";
import { ClassLoader, Logger, OASUtils } from "@composer-js/core";
import Generator from "./Generator";
import * as path from "path";
import * as shelljs from "shelljs";
import * as merge from "deepmerge";
const packageInfo = require("../package.json");

const printHelp = function(templates: string[]) {
    console.log("Usage: composer -i <input> -o <output> -l <language> -t <type>");
    console.log("");
    console.log("\t\t-i --input\tThe input OpenAPI specification file to generate from.");
    console.log("\t\t\t\tAccepts JSON or YAML formatted files. Specify this option multiple times to merge files.");
    console.log("\t\t-o --output\tThe destination path to write all files to.");
    console.log("\t\t-a --add\tThe path to one or more additional files to be include.");
    console.log("\t\t-v --version\tDisplays the release version of the tool.");
    console.log("\t\t-h --help\tDisplays this help menu.");
    console.log("\t\t-t --template\tThe template use for file generation.");
    console.log("\t\t\t\tSupported Templates:");
    for (const template of templates) {
        console.log("\t\t\t\t\t" + template);
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
    { name: "template", alias: "t", type: String },
    { name: "add", alias: "a", type: String, multiple: true },
    { name: "version", alias: "v", type: Boolean },
    { name: "help", alias: "h", type: Boolean }
]);

const logger = Logger(cliOptions["verbose"] ? "debug" : "info");
const processCommandLine = async () =>{
    try {
        const pwd: string = shelljs.pwd().toString();

        if (cliOptions["version"]) {
            printVersion();
            process.exit(0);
        }

        // Load all available generator classes
        const cl: ClassLoader = new ClassLoader(path.join(__dirname, "./generators"));
        await cl.load();

        // Build a map of all generator language => type => generator
        const generators: any = {};
        for (const pair of cl.getClasses()) {
            const name: string = pair[0];
            const clazz: any = pair[1];
            const gen: Generator = new clazz(logger);
            generators[name] = gen;
        }

        if (cliOptions["help"]) {
            printHelp(generators);
            process.exit(0);
        }
    
        // Make sure all required options have been set.
        if (!cliOptions["output"]) {
            console.error("Error: No output directory specified.");
            printHelp(generators);
            process.exit(1);
        }
        if (!cliOptions["language"]) {
            console.error("Error: No language specified.");
            printHelp(generators);
            process.exit(1);
        }
        if (!cliOptions["type"]) {
            console.error("Error: No type specified.");
            printHelp(generators);
            process.exit(1);
        }
    
        // Validate the selected template
        if (!generators.includes(cliOptions["template"])) {
            console.error("Error: Unsupported template specified: " + cliOptions["template"]);
            console.log("");
            console.log("Supported Templates:");
            for (const template in generators) {
                console.log("\t" + template);
            }
            process.exit(1);
        }
    
        // Load all OpenAPI specifications into one document
        let apiSpec: any = undefined;
        for (const spec of cliOptions["input"]) {
            try {
                const specPath: string = path.resolve(path.join(pwd, spec));
                apiSpec = merge(await OASUtils.loadSpec(specPath), apiSpec || {});
            } catch (err) {
                console.error("File is an invalid or malformed OpenAPI specification file: " + spec);
                console.error(err);
                process.exit(1);
            }
        }

        // Run the desired generator
        const generator: Generator = generators[cliOptions["template"]];
        generator.init();
        await generator.generate(apiSpec, path.resolve(path.join(pwd, cliOptions["output"])), cliOptions["add"]);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

export default processCommandLine;

if (require.main === module) {
    void processCommandLine();
}