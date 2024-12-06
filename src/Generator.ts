///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
/**
 * The `Generator` interface defines a class that can implement code generation for a given OpenAPI specification.
 */
export default interface Generator {
    /**
     * Returns the path to the template files for this generator.
     */
    templatePath: string;

    /**
     * Initializes the generator with any defaults.
     */
    init(): void;

    /**
     * Generates all code and files for a given template.
     * 
     * @param apiSpec The OpenAPI specification to generate code from.
     * @param outputPath The output directory to write all generated files to.
     * @param addtlFiles The list of additional files to copy to the destination.
     */
    generate(apiSpec: any, outputPath: string, addtlFiles: string[]): Promise<void>;
}