///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 &lt;COPYRIGHT&gt;
///////////////////////////////////////////////////////////////////////////////
import { BackgroundService } from "@composer-js/service-core";
import * as prom from "prom-client";

/**
 * The `MetricsCollector` provides a background service for collecting Prometheseus metrics for consumption by external
 * clients and compatible servers using the built-in `MetricsRoute` route handler.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export default class MetricsCollector extends BackgroundService {
    private registry: prom.Registry;

    constructor(config: any, logger: any) {
        super(config, logger);
        this.registry = prom.register;
    }

    public run(): void {
        // TODO
    }

    public async start(): Promise<void> {}

    public async stop(): Promise<void> {}
}
