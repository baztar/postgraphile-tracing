const { makeWrapResolversPlugin } = require("graphile-utils");
const { tracer } = require("./tracer");

module.exports = makeWrapResolversPlugin(
    (context) => {
        if (context.scope.fieldName === 'titleBasicByTconst') {
            console.log(context.scope);
        }
        if (!('isRootQuery' in context.scope) && 'pgFieldIntrospection' in context.scope && (context.scope.pgFieldIntrospection.kind === 'class' || context.scope.pgFieldIntrospection.kind === 'constraint')) {
            return { scope: context.scope }
        }
        return null;
    },
    ({ scope }) => async (resolver, user, args, context, _resolveInfo) => {
        const { currentSpan } = context;
        const span = tracer.startSpan(_resolveInfo.fieldName, { childOf: currentSpan.span });
        // context.currentSpan = { span }
        console.log(scope);
        // console.log(_resolveInfo.fieldNodes);
        span.setTag("args", args);
        const result = await resolver();
        span.finish();
        return result;
    }
);
