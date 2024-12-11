///////////////////////////////////////////////////////////////////////////////
// Copyright (C) {{year}} {{copyright}}
///////////////////////////////////////////////////////////////////////////////
import { ObjectDecorators } from "@composer-js/core";
import { BackgroundService } from "@composer-js/service-core";
const { Init } = ObjectDecorators;

/**
 * The `MetricsCollector` provides a background service for collecting Prometheseus metrics for consumption by external
 * clients and compatible servers using the built-in `MetricsRoute` route handler.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export default class MetricsCollector extends BackgroundService {
    constructor(config: any, logger: any) {
        super(config, logger);
    }

    public get schedule(): string | undefined {
        return "* * * *";
    }

    @Init
    public init() {
        // TODO
    }

    public run() {
        // TODO
    }

    public async start(): Promise<void> {} // eslint-disable-line typescript/no-empty-function

    public async stop(): Promise<void> {} // eslint-disable-line typescript/no-empty-function
}
