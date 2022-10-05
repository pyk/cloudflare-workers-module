import React from "react";
import { renderToReadableStream } from "react-dom/server";

// Import layout
import RootLayout from "./layout";

// Import pages
import CoinsIdPage from "./coins/[id]/page";

// Components
import Counter from "../components/counter";

const CoinsIdPageMarkup = (
    <RootLayout>
        <CoinsIdPage />
    </RootLayout>
);

export interface Env {}

const AppManifest = {
    "/": {
        layout: RootLayout,
    },
};

const coinHandler = () => {
    return new Response("coinHandler");
};

const CounterPage = () => (
    <html>
        <head>
            <title>Counter</title>
            <script defer src="/assets/client.js" />
        </head>
        <body>
            <h1>Counter</h1>
            <Counter />
        </body>
    </html>
);

const counterHandler = async () => {
    const stream = await renderToReadableStream(<CounterPage />);
    return new Response(stream);
};

const patternsToHandlers = new Map([
    [{ pathname: "/coins/:id" }, coinHandler],
    [{ pathname: "/counter" }, counterHandler],
]);

const routingMap = new Map();
for (const [patternInput, handler] of patternsToHandlers) {
    const compiledPattern = new URLPattern(patternInput);
    routingMap.set(compiledPattern, handler);
}

import {
    getAssetFromKV,
    NotFoundError,
    MethodNotAllowedError,
} from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
const assetManifest = JSON.parse(manifestJSON);

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        if (request.url.includes("/assets/")) {
            try {
                return await getAssetFromKV(
                    {
                        request,
                        waitUntil(promise) {
                            return ctx.waitUntil(promise);
                        },
                    },
                    {
                        ASSET_NAMESPACE: env.__STATIC_CONTENT,
                        ASSET_MANIFEST: assetManifest,
                    }
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    // ...
                } else if (e instanceof MethodNotAllowedError) {
                    // ...
                } else {
                    return new Response("An unexpected error occurred", {
                        status: 500,
                    });
                }
            }
        } else {
            for (const [compiledPattern, handler] of routingMap) {
                const result = compiledPattern.exec(request.url);
                if (result) {
                    console.log("DEBUG: result", result);
                    return handler();
                }
            }
            return new Response("Handler not found");
        }
    },
};
