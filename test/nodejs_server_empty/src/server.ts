#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 &lt;COPYRIGHT&gt;
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import { Logger, OASUtils } from "@composer-js/core";
import { BackgroundServiceManager, Server } from "@composer-js/service-core";

import * as commandLineArgs from "command-line-args";
import * as fs from "fs";
import * as process from "process";
import * as os from "os";

const logger = Logger();

// Parse the CLI options
const cliDefinitions: commandLineArgs.OptionDefinition[] = [];
const cliOptions = commandLineArgs(cliDefinitions);
let server: Server | undefined = undefined;
let bgManager: BackgroundServiceManager | undefined = undefined;

const start = async function(config: any, logger: any) {
    // Load the OpenAPI specification file
    let apiSpec = undefined;
    try {
        apiSpec = fs.existsSync("openapi.json")
            ? await OASUtils.loadSpec("openapi.json")
            : await OASUtils.loadSpec("openapi.yaml");
        if (!apiSpec) {
            throw new Error("Failed to load OpenAPI specification.");
        }
    } catch (err) {
        logger.warn("No OpenAPI specification file found. Automatic service discovery may be broken.");
        logger.warn("Generate a new OpenAPI specification file using the --genspec flag.");
        logger.info(err);
    }

    // Create and start the server
    server = new Server(config, apiSpec, __dirname, logger);
    await server.start();

    // Start all background services
    bgManager = new BackgroundServiceManager(__dirname, config, logger);
    await bgManager.startAll();
};

start(config, logger);

process.on("SIGINT", async () => {
    logger.info("Shutting down...");
    if (bgManager) {
        bgManager.stopAll();
    }
    if (server) {
        await server.stop();
    }
    process.exit(0);
});
