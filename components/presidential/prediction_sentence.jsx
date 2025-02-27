import React, { useRef, useState } from "react";

import DragDropdown from "./drag_dropdown";
import HintMark from "../hint_mark";

const partiesOptions = [
    {
        display: "Democrat",
        value: "d"
    },
    {
        display: "Republican",
        value: "r"
    }
];

const likelihoodOptions = [
    {
        value: "tilt"
    },
    {
        value: "lean"
    },
    {
        value: "likely"
    },
    {
        value: "safe"
    }
];

export default function _predictionSentence({ setTooltip, predictionChanged }) {
    const likelihoodPrediction = useRef('tilt');
    const partyPrediction = useRef('d');

    const [ prediction, setPrediction ] = useState(`${likelihoodPrediction.current}-${partyPrediction.current}`);

    const predictionChanged_internal = (likelihood, party) => {
        const prediction = `${likelihood}-${party}`;

        setPrediction(prediction);
        if (predictionChanged) {
            predictionChanged(prediction);
        }
    };

    const tooltip = (
        <div className="tooltip-panel">
            <ul className="prediction-tooltip-list">
                <li className="prediction-tooltip-list-item">
                    <span className={ "tilt-" + partyPrediction.current }>Tilt</span> 
                    <span>&lt;1%</span>
                </li>
                <li className="prediction-tooltip-list-item">
                    <span className={ "lean-" + partyPrediction.current }>Lean</span> 
                    <span>1-4%</span>
                </li>
                <li className="prediction-tooltip-list-item">
                    <span className={ "likely-" + partyPrediction.current }>Likely</span> 
                    <span>4-8%</span>
                </li>
                <li className="prediction-tooltip-list-item">
                    <span className={ "safe-" + partyPrediction.current }>Safe</span> 
                    <span>&gt;8%</span>
                </li>
            </ul>
        </div>
    );

    return (
        <div className="prediction-sentence-container">
            <div className="prediction-sentence">
                <span>Left click to assign </span>
                <span>
                    <DragDropdown 
                        options={ likelihoodOptions } 
                        optionSelected={ 
                            (_, value) => {
                                likelihoodPrediction.current = value;
                                predictionChanged_internal(value, partyPrediction.current);
                            }
                        }
                        classes={{
                            active: prediction,
                            child: "justify-right"
                        }}
                    />
                </span>
                &nbsp;
                <HintMark setTooltip={setTooltip} tooltip={tooltip} />
                &nbsp;
                <span>
                    <DragDropdown 
                        options={ partiesOptions } 
                        optionSelected= {
                            (_, value) => {
                                partyPrediction.current = value;
                                predictionChanged_internal(likelihoodPrediction.current, value);
                            }
                        }
                        classes={{
                            active: prediction
                        }}
                    />
                </span>
                <span> states</span>
            </div>
            <span className="prediction-sentence-subtext">Right click to remove</span>
        </div>
    );
};