const express = require("express");
const { postgraphile, makePluginHook } = require("postgraphile");
const httpPlugin = require('./http_plugin');
const rootQueryPlugin = require('./root_query_plugin');
const nestedQueryPlugin = require('./nested_query_plugin');

const app = express();
const pluginHook = makePluginHook([httpPlugin]);

app.use(
  postgraphile(
    process.env.DATABASE_URL || "postgres://baztar:123@localhost:5432/imdb",
    "public",
    {
      pluginHook,
      graphiql: true,
      enhanceGraphiql: true,
      async additionalGraphQLContextFromRequest(req) {
        return {
          rootSpan: req._root_span,
        }
      },
      appendPlugins: [
        rootQueryPlugin,
        nestedQueryPlugin,
      ],
    }
  )
);

app.listen(process.env.PORT || 3000);
