///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
/**
 * The `Generator` interface defines a class that can implement code generation for a given OpenAPI specification.
 */
export default interface Generator {
    /**
     * Returns the language that the generator will produce.
     */
    language: string;

    /**
     * Returns the application type (server,client) that the generator will produce.
     */
    type: string;

    /**
     * Initializes the generator with any defaults.
     */
    init(): void;

    /**
     * Generates all code and files for a given template type and language.
     * 
     * @param apiSpec The OpenAPI specification to generate code from.
     * @param outputPath The output directory to write all generated files to.
     * @param addtlFiles The list of additional files to copy to the destination.
     */
    generate(apiSpec: any, outputPath: string, addtlFiles: string[]): Promise<void>;
}