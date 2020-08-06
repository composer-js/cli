===============================================================================
{{{Route}}} Route
===============================================================================
{{#if description}}

{{description}}
{{/if}}
{{#if parameters}}

Parameters
==========

.. list-table::
   :header-rows: 1
   
   * - Name
     - Description
     - Type
{{#each parameters}}
    * - {{name}}
      - {{description}}
      - {{Schema}}
{{/each}}

{{/if}}

Routes
======
{{#each routes}}

{{Name}}
-------------------------------------------------------------------------------
``{{{METHOD}}} <base_url>{{{@root.endpoint}}}{{#if path}}{{{path}}}{{/if}}``

Authentication: {{#if security}}**Required**{{else}}Optional{{/if}}

{{{description}}}
{{#each params}}

Parameters
^^^^^^^^^^
====
Name
====
{{{this}}}
====
{{/each}}
{{#if hasQuery}}

Query
^^^^^

.. list-table::
   :header-rows: 1
   
   * - Name
     - Description
     - Type
     - Default Value
   * - limit
     - The maximimum number of results to return. Cannot exceed ``1000``.
     - number
     - ``100``
   * - skip
     - The number of items to skip in the results (pagination).
     - number
     - ``0``
   * - sort
     - An object containing the name of the member to sort by and the order in which to sort.
     - object
     - ``{ member: "<ASC|DESC>" }``
{{#each schemaMembers}}
   * - {{{name}}}
     - {{description}}
     - {{type}}{{#if format}} {{format}}{{/if}}
     - {{{defaultValue}}}
{{/each}}
{{/if}}
{{#with request}}

Request
^^^^^^^
.. code-block:: http

    {{{METHOD}}} {{{path}}}
    {{#if contentType}}
    Content-Type: {{{contentType}}}
    {{/if}}
    {{#if security}}
    Authorization: jwt <token>
    {{/if}}
    {{#if example}}

    {{{example}}}
    {{/if}}

{{/with}}
{{#with response}}
Response
^^^^^^^^
.. code-block:: http

    {{code}}
    {{#if contentType}}
    Content-Type: {{{contentType}}}
    {{/if}}
    {{#if security}}
    Authorization: jwt <token>
    {{/if}}
    {{#if example}}

    {{{example}}}
    {{/if}}

{{/with}}
{{/each}}