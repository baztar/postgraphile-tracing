const { makeWrapResolversPlugin } = require("graphile-utils");
const { tracer } = require("./tracer");

module.exports = makeWrapResolversPlugin(
    (context) => {
        if (context.scope.isRootMutation || context.scope.isRootQuery) {
            return { scope: context.scope }
        }
        return null;
    },
    ({ scope }) => async (resolver, user, args, context, _resolveInfo) => {
        const { rootSpan } = context;
        const span = tracer.startSpan(_resolveInfo.fieldName, { childOf: rootSpan.span });
        context.currentSpan = { span }
        // console.log(scope);
        // console.log(scope.pgFieldIntrospection);
        // console.log(scope.pgFieldIntrospection.kind);
        span.setTag("args", args);
        const result = await resolver();
        span.finish();
        return result;
    }
);
