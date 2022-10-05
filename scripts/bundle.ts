/**
 * Bundle client-side JavaScript
 */
import { build, analyzeMetafile } from "esbuild";

async function main() {
    const result = await build({
        entryPoints: ["app/client.tsx"],
        bundle: true,
        minify: true,
        metafile: true,
        sourcemap: true,
        target: ["chrome58", "firefox57", "safari11", "edge18"],
        charset: "utf8",
        outfile: "public/assets/client.js",
    });

    const text = await analyzeMetafile(result.metafile);
    console.log(text);
}

main();
