import * as compare from "dir-compare";
import { Logger, OASUtils } from '@composer-js/core';
import NodejsServerGenerator from "../src/generators/NodejsServerGenerator";
import * as path from "path";
import * as rimraf from "rimraf";

describe("NodejsServerGenerator Tests", () => {
    beforeAll(() => {
        rimraf.sync(path.join(__dirname, "tmp"));
    });

    afterAll(() => {
        rimraf.sync(path.join(__dirname, "tmp"));
    });

    it("Can generator project successfully.", async () => {
        const apiSpec: any = await OASUtils.loadSpec(path.join(__dirname, "petstore.yaml"));
        expect(apiSpec).toBeDefined();

        // Generate the project
        const generator: NodejsServerGenerator = new NodejsServerGenerator(Logger());
        generator.init(path.join(__dirname, "..", "templates"));
        await generator.generate(apiSpec, path.join(__dirname, "tmp"), []);

        // Now scan the resulting directory to see if it matches our sample
        const result: compare.Result = await compare.compare(path.join(__dirname, "nodejs_server_petstore"), path.join(__dirname, "tmp"), { compareContent: true, excludeFilter: "**/*.md" });
        expect(result.same).toBeTruthy();
    });

    });
});