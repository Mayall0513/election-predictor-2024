import React, { useRef, useState } from "react";

import DragDropdown from "./drag_dropdown";

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

export default function _predictionSentence({ predictionChanged }) {
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