const { tracer } = require("./tracer");

module.exports = {
    ["postgraphile:http:handler"](req) {
        const span = tracer.startSpan("root_span");
        req._root_span = { span };
        
        return req;
    },

    ["postgraphile:http:end"](result, { req }) {
        req._root_span.span.finish();
        return result;
    },
};
