import React from "react";
import ReactDOMServer from "react-dom/server";

// Import layout
import RootLayout from "./layout";

export interface Env {}

const AppManifest = {
    "/": {
        layout: RootLayout,
    },
};

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        const stream = await ReactDOMServer.renderToReadableStream(
            <RootLayout />
        );
        return new Response(stream);
    },
};
