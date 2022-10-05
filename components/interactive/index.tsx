import React from "react";

interface InteractiveProps {
    children: ReactNode;
    name: string;
}

/**
 * Interactive Component Wrapper
 *
 * This component is used to wrap any component that requires client hydration.
 *
 * Usage:
 *      <Interactive name="Button">
 *          <Button />
 *      </Interactive>
 */
export default function Interactive(props: InteractiveProps) {
    const { children, name } = props;

    const hydrationProps = JSON.stringify(React.Children.only(children).props);
    return (
        <div
            // We will use this tag to find and hydrate the children component
            // in the browser
            data-interactive-component={name}
            data-interactive-component-props={hydrationProps}
        >
            {children}
        </div>
    );
}
