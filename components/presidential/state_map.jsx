import React from "react";
import { useState } from "react";

import { predictionEnumeration, predictionMap, presidentialStates as states } from "../../data/elections";

const smallStatePanels = {
    dimensions: {
        start: {
            x: 924,
            y: 240
        }, 
        size: {
            width: 56,
            height: 28
        },
        padding: {
            y: 4
        }
    },
};

export default function _stateMap({ startPrediction, currentPrediction, predictionChanged, onStateHovered: _onStateHovered, onStateUnhovered: _onStateUnhovered }) {
    const masks = {};
    const elements = [];
    const [ predictions, setPredictions ] = useState(startPrediction || {});

    let smallStatesAdded = 0;

    const onStateClicked = (event, key, leftClick) => {
        event.preventDefault();
        let stateChanged = false;

        if (currentPrediction) {
            if (leftClick) {
                if (predictions[key] !== predictionMap[currentPrediction]) {
                    stateChanged = true;
                }

                predictions[key] = predictionMap[currentPrediction];
            }

            else {
                if (null !== predictions[key]) {
                    stateChanged = true;
                }

                delete predictions[key];
            }

            setPredictions({ ... predictions });
        }

        if (stateChanged && predictionChanged) {
            const predictionsWithMetadata = { };

            for (const state in predictions) {
                const prediction = predictionEnumeration[predictions[state]];

                predictionsWithMetadata[state] = {
                    prediction: prediction,
                    name: states[state].name,
                    votes: states[state].votes
                };
            }

            predictionChanged(predictionsWithMetadata);
        }
    }
    
    const stateEntries = Object.entries(states)
    for (const [ key, state ] of stateEntries) {
        if (state.parent) {
            if (!masks[state.parent]) {
                masks[state.parent] = [];
            }

            masks[state.parent].push(
                <path 
                    key={ `${key}_mp` }
                    d={ state.path }
                    fill={ "black" }
                />
            );
        }
    }

    for (const state in masks) {
        masks[state] = (
            <mask
                key={ `${state}_m` } 
                id={ `${state}_mask` }
            >
                <rect width="100%" height="100%" fill="white"/>
                { masks[state] }
            </mask>
        );
    }

    for (const [ key, state ] of stateEntries) {
        const prediction = undefined !== predictions[key]
            ? " " + predictionEnumeration[predictions[key]]
            : "";

        if (state.small) {
            const x0 = smallStatePanels.dimensions.start.x;
            const x1 = x0 + smallStatePanels.dimensions.size.width;

            const y0 = smallStatePanels.dimensions.start.y + (smallStatesAdded++ * (smallStatePanels.dimensions.size.height + smallStatePanels.dimensions.padding.y));
            const y1 = y0 + smallStatePanels.dimensions.size.height;

            elements.push(
                <g key={ key }>
                    <path 
                        key={ key + "_s" }
                        id={ key }
                        d={ state.path + `M${x0},${y0}L${x1},${y0}L${x1},${y1}L${x0},${y1}Z` }
                        className={ "state" + prediction }
                        onPointerEnter={ () => _onStateHovered && _onStateHovered(key) }
                        onPointerLeave={ () => _onStateUnhovered && _onStateUnhovered(key) }
                        onClick={ (event) => onStateClicked(event, key, true) }
                        onContextMenu={ (event) => onStateClicked(event, key, false) }
                        mask={ masks[key] ? `url(#${key}_mask)` : null }
                    />
                    <text 
                        key={ key + "_t" }
                        x={ x0 + (smallStatePanels.dimensions.size.width / 2) }
                        y={ y0 + (smallStatePanels.dimensions.size.height / 2) }
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="state-panel-tooltip"
                    >
                        { key.toUpperCase() }
                    </text>
                </g>
            );
        }

        else {
            elements.push(
                <path 
                    key={ key }
                    id={ key }
                    d={ state.path }
                    className={ "state" + prediction }
                    onPointerEnter={ () => _onStateHovered && _onStateHovered(key) }
                    onPointerLeave={ () => _onStateUnhovered && _onStateUnhovered(key) }
                    onClick={ (event) => onStateClicked(event, key, true) }
                    onContextMenu={ (event) => onStateClicked(event, key, false) }
                    mask={ masks[key] ? `url(#${key}_mask)` : null }
                />
            );
        }
    }

    return (
        <svg viewBox="0 0 1000 620">
            <defs>
                { Object.values(masks) }
            </defs>
            <g className="state-map">
                { elements }
            </g>
        </svg>
    );
};