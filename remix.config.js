/** @type {import('@remix-run/dev').AppConfig} */
export default {
    ignoredRouteFiles: ['**/*.css'],
    browserNodeBuiltinsPolyfill: {
        modules: {crypto: true, buffer: true, stream: true, util: true}
    }
    // appDirectory: "app",
    // assetsBuildDirectory: "public/build",
    // publicPath: "/build/",
    // serverBuildPath: "build/index.js",
};
