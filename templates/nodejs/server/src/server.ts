#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////
// Copyright (C) {{year}} {{copyright}}
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import { JWTUtils, EventUtils, Logger } from "@composer-js/core";
import { ObjectFactory, Server } from "@composer-js/service-core";
import * as process from "process";
import * as os from "os";

const logger = Logger();

const objectFactory = new ObjectFactory(config, logger);
let server: any = undefined;

const start = async function (config: any, logger: any) {
    // Initialize EventUtils to be able to send out telemetry events
    const auth: any = config.get("auth");
    delete auth.options.expiresIn;
    const token: string = JWTUtils.createToken(auth,
        {
            uid: `${config.get("service_name")}-${os.hostname()}`,
            name: `${config.get("service_name")}-${os.hostname()}`,
            roles: config.get("trusted_roles"),
        });
    EventUtils.init(config, logger, token);

    // Create and start the server
    server = new Server(config, __dirname, logger, objectFactory);
    await server.start();
};

void start(config, logger);

process.on("SIGINT", async () => {
    logger.info("Shutting down...");
    if (server) {
        await server.stop();
    }
    if (objectFactory) {
        await objectFactory.destroy();
    }
    process.exit(0);
});
