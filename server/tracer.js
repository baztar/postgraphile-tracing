const { initTracer } = require("./tracing");

module.exports.tracer = initTracer("nodejs-imdb");
