import { useEffect, useState } from 'react';

const offset = {
    x: 12,
    y: -12
};

export default function _tooltip({ contents }) {
    const [ mouseCoordinates, setMouseCoordinates ] = useState({ x: 0, y: -1000 });

    const repositionTooltip = (event) => {
        setMouseCoordinates({ x: event.clientX + offset.x, y: event.clientY + offset.y });
    }

    useEffect(() => {
        window.addEventListener('mousemove', repositionTooltip);

        return () => {
            window.removeEventListener('mousemove', repositionTooltip);
        };
    });

    if (!contents) {
        return;
    }

    return (
        <div className="tooltip" style={
            {
                top: mouseCoordinates.y,
                left: mouseCoordinates.x
            }
        }>
            { contents }
        </div>
    );
};