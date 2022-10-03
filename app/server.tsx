import React from "react";
import ReactDOMServer from "react-dom/server";

// Import layout
import RootLayout from "./layout";

// Import pages
import CoinsIdPage from "./coins/[id]/page";

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

const patternsToHandlers = new Map([
    [{ pathname: "/coins/:id" }, coinHandler],
]);

const routingMap = new Map();
for (const [patternInput, handler] of patternsToHandlers) {
    const compiledPattern = new URLPattern(patternInput);
    routingMap.set(compiledPattern, handler);
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        for (const [compiledPattern, handler] of routingMap) {
            const result = compiledPattern.exec(request.url);
            if (result) {
                console.log("DEBUG: result", result);
                return handler();
            }
        }
        return new Response("Handler not found");
    },
};
