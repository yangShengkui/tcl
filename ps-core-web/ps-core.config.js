const pathLib = require("path");
let filepath = pathLib.resolve(__filename, "../");
module.exports = {
    name: "core",
    output: pathLib.resolve(__filename, "./ps-core/output.js"),
    templates: {
        path: pathLib.resolve(filepath, "./ps-core/templates"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    controllers: {
        path: pathLib.resolve(filepath, "./ps-core/controllers"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    directives: {
        path: pathLib.resolve(filepath, "./ps-core/directives"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    components: {
        path: pathLib.resolve(filepath, "./ps-core/components"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    services: {
        path: pathLib.resolve(filepath, "./ps-core/services"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    filters: {
        path: pathLib.resolve(filepath, "./ps-core/filters"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    styles: {
        path: pathLib.resolve(filepath, "./ps-core/styles"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    }
}