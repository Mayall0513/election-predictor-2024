import { useEffect, useState } from 'react';

const offset = {
    x: 14,
    y: -14
};

export default function _tooltip({ contents }) {
    const [ mouseCoordinates, setMouseCoordinates ] = useState({ x: 0, y: -1000 });

    const repositionTooltip = (event) => {
        setMouseCoordinates({ x: event.screenX + offset.x, y: event.screenY + offset.y });
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