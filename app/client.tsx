import React, { Component } from "react";
import { hydrateRoot } from "react-dom/client";

import Counter from "../components/counter";

/**
 * Given pair of (component name, component), `hydrate` will look up all
 * server-rendered intractive component then hydrate it one by one.
 * */
function hydrate(components: Map<string, Component>) {
    document
        .querySelectorAll("[data-interactive-component]")
        .forEach((component) => {
            const Component =
                components[component.dataset.interactiveComponent];

            if (!Component) {
                console.warn(
                    `Found a server-rendered Interactive Component for ${component.dataset.interactiveComponent} but that component was not passed to hydrate`
                );
                return;
            }

            const hydrationProps = JSON.parse(
                component.dataset.interactiveComponentProps
            );
            hydrateRoot(
                component,
                <Component {...hydrationProps} />
            );
        });
}

hydrate({Counter});
