const { makeWrapResolversPlugin } = require("graphile-utils");
const { tracer } = require("./tracer");

module.exports = makeWrapResolversPlugin(
    (context) => {
        if (context.scope.isRootQuery || !('isRootQuery' in context.scope) && 'pgFieldIntrospection' in context.scope && 
                (context.scope.pgFieldIntrospection.kind === 'class' || context.scope.pgFieldIntrospection.kind === 'constraint')) {
            return { scope: context.scope }
        }
        return null;
    },
    ({ scope }) => async (resolver, user, args, context, _resolveInfo) => {
        const { rootSpan, pgClient } = context;
        const span = tracer.startSpan(_resolveInfo.fieldName, { childOf: rootSpan.span });

        // span.setTag("args", args);

        const result = await resolver();

        span.setTag("query", Object.values(pgClient.connection.parsedStatements).join(",\n"))
        
        span.finish();

        return result;
    }
);
