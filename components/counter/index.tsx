import React, { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);
    const hydrationProps = JSON.stringify({});

    return (
        <div
            data-interactive-component="Counter"
            data-interactive-component-props={hydrationProps}
        >
            Counter is at {count}.{" "}
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
    );
}
