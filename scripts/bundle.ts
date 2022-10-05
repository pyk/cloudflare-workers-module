/**
 * Bundle client-side JavaScript
 */
import { build, analyzeMetafile } from "esbuild";

async function main() {
    const minify = process.env.NODE_ENV == "production" ? true : false;
    const result = await build({
        entryPoints: ["app/client.tsx"],
        bundle: true,
        minify: minify,
        metafile: true,
        sourcemap: true,
        target: ["chrome58", "firefox57", "safari11", "edge18"],
        charset: "utf8",
        outfile: "public/assets/client.js",
    });

    const text = await analyzeMetafile(result.metafile, { verbose: true });
    console.log(text);
}

main();
