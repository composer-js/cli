///////////////////////////////////////////////////////////////////////////////
// Copyright (C) {{year}} {{{copyright}}}
///////////////////////////////////////////////////////////////////////////////
import { Column, Entity, Index } from "typeorm";
import { {{#if baseClass}}{{baseClass}}{{/if}}, DocDecorators, ModelDecorators } from "@composer-js/service-core";
import { ObjectDecorators, ValidationUtils } from "@composer-js/core";
{{#each dependencies}}
import {{this}} from "./{{this}}";
{{/each}}
const { Description } = DocDecorators;
const {
    {{#if cached}}Cache,{{/if}}
    DataStore,
    Identifier,
    {{#if shard}}Shard,{{/if}}
    {{#if versioned}}TrackChanges,{{/if}}
} = ModelDecorators;
const { Nullable, Validator } = ObjectDecorators;

{{#each properties}}
{{#if (eq this.type "enum")}}

/**
 * {{{this.description}}}
 */
export enum {{{Schema}}}{{{this.Name}}} {
{{#each this.values}}
    {{this}} = "{{this}}",
{{/each}}
}
{{/if}}
{{/each}}

{{#if (or author description)}}
/**
 * {{{description}}}
 *
 * @author {{{author}}}
 */
{{/if}}
@Entity()
{{#if cached}}@Cache({{#if (not cached true)}}{{cached}}{{/if}}){{/if}}
@DataStore("{{datastore}}")
{{#if versioned}}@TrackChanges({{#if (not versioned true)}}{{versioned}}{{/if}}){{/if}}
{{#if shard}}@Shard({{#if (not shard true)}}{{shard}}{{/if}}){{/if}}
export default class {{{Schema}}}{{#if baseClass}} extends {{baseClass}}{{/if}} {
{{#each properties}}
{{#if this.description}}
    @Description(`
        {{{this.description}}}
    `)
{{/if}}
{{#if this.identifier}}
    @Identifier
    @Index()
{{/if}}
    @Column()
{{#if nullable}}
    @Nullable
{{/if}}
{{#if validator}}
    @Validator({{{validator}}})
{{/if}}
    public {{{this.name}}}{{#if nullable}}?{{/if}}: {{#if (eq this.type "enum")}}{{{Schema}}}{{{this.Name}}}{{else}}{{{this.type}}}{{/if}}{{#if (not nullable)}} = {{#if (eq this.type "enum")}}{{{Schema}}}{{{this.Name}}}.{{/if}}{{{this.defaultValue}}}{{/if}};

{{/each}}
    constructor(other?: any) {
{{#if baseClass}}
        super(other);
        
{{/if}}
        if (other) {
{{#each properties}}
            this.{{{this.name}}} = "{{{this.name}}}" in other ? other.{{{this.name}}} : this.{{{this.name}}};
{{/each}}
        }
    }
}
