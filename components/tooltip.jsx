import { useEffect, useState } from 'react';

const offset = {
    x: 14,
    y: -14
};

export default function Tooltip({ contents }) {
    const [ mouseCoordinates, setMouseCoordinates ] = useState({ x: 0, y: -1000 });

    const repositionTooltip = (event) => {
        setMouseCoordinates({ x: event.pageX + offset.x, y: event.pageY + offset.y });
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
                position: "fixed",
                top: mouseCoordinates.y,
                left: mouseCoordinates.x
            }
        }>
            { contents }
        </div>
    );
};