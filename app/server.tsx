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
