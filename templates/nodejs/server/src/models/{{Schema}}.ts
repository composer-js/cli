///////////////////////////////////////////////////////////////////////////////
// Copyright (C) {{year}} {{{copyright}}}
///////////////////////////////////////////////////////////////////////////////
import { Column, Entity, Index } from "typeorm";
import { {{#if this["x-baseClass"]}}{{this["x-baseClass"]}}, DocDecorators, ModelDecorators } from "@composer-js/service-core";
const { Description } = DocDecorators;
const {
    {{/if}}{{#if this["x-cached"]}}Cache,{{/if}}
    DataStore,
    Identifier,
    {{#if this["x-shard"]}}Shard,{{/if}}
    {{#if this["x-versioned"]}}TrackChanges,{{/if}}
} = ModelDecorators;
{{#each dependencies}}
import {{this}} from "./{{this}}";
{{/each}}
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

/**
 * {{{description}}}
 *
 * @author {{{author}}}
 */
@Entity()
{{#if this["x-cached"]}}@Cache({{#if (not this["x-cached"] true)}}{{this["x-cached"]}}{{/if}}){{/if}}
@DataStore("{{this["x-datastore"]}}")
{{#if this["x-versioned"]}}@TrackChanges({{#if (not this["x-versioned"] true)}}{{this["x-versioned"]}}{{/if}}){{/if}}
{{#if this["x-shard"]}}@Shard({{#if (not this["x-shard"] true)}}{{this["x-shard"]}}{{/if}}){{/if}}
export default class {{{Schema}}}{{#if this["x-baseClass"]}} extends {{this["x-baseClass"]}}{{/if}} {
{{#each properties}}
    @Description("{{{this.description}}}")
    {{#if this.identifier}}
    @Identifier
    @Index()
    {{/if}}
    @Column()
    public {{{this.name}}}: {{#if (eq this.type "enum")}}{{{Schema}}}{{{this.Name}}} = {{{Schema}}}{{{this.Name}}}.{{{this.defaultValue}}}{{else}}{{{this.type}}}{{#if nullable}} | undefined{{/if}} = {{#if nullable}}undefined{{else}}{{{this.defaultValue}}}{{/if}}{{/if}};

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
