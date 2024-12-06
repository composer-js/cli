import * as compare from "dir-compare";
import { Logger, OASUtils } from '@composer-js/core';
import NodejsServerGenerator from "../src/generators/NodejsServer";
import * as path from "path";
import * as rimraf from "rimraf";

describe("NodejsServerGenerator Tests", () => {
    beforeEach(() => {
        rimraf.sync(path.join(__dirname, "tmp"));
    });

    afterEach(() => {
        // rimraf.sync(path.join(__dirname, "tmp"));
    });

    it("Can generate files using OpenAPI spec successfully.", async () => {
        const apiSpec: any = await OASUtils.loadSpec(path.join(__dirname, "petstore.yaml"));
        expect(apiSpec).toBeDefined();

        // Generate the project
        const generator: NodejsServerGenerator = new NodejsServerGenerator(Logger());
        generator.init();
        await generator.generate(apiSpec, path.join(__dirname, "tmp"), []);

        // Now scan the resulting directory to see if it matches our sample
        const result: compare.Result = await compare.compare(path.join(__dirname, "nodejs_server_petstore"), path.join(__dirname, "tmp"), { compareContent: true, excludeFilter: "**/*.md" });
        expect(result.same).toBeTruthy();
    });

    it("Can generate files without OpenAPI spec successfully.", async () => {
        // Generate the project
        const generator: NodejsServerGenerator = new NodejsServerGenerator(Logger());
        generator.init();
        await generator.generate(undefined, path.join(__dirname, "tmp"), []);

        // Now scan the resulting directory to see if it matches our sample
        const result: compare.Result = await compare.compare(path.join(__dirname, "nodejs_server_empty"), path.join(__dirname, "tmp"), { compareContent: true, excludeFilter: "**/*.md" });
        expect(result.same).toBeTruthy();
    });
});