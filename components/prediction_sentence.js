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
    },
    { 
        display: "independent",
        value: "i"
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

export default function PredictionSentence({ predictionChanged }) {
    const likelihoodPrediction = useRef('tilt');
    const partyPrediction  = useRef('r');

    const [ prediction, setPrediction ] = useState('tilt-d');

    return (
        <div>
            <span>I&apos;m predicting </span>
            <span>
                <DragDropdown 
                    options={ partiesOptions } 
                    optionSelected= { (index, value) => { 
                        partyPrediction.current = value; 
                        setPrediction(likelihoodPrediction.current + '-' + value); 
                        
                        if (predictionChanged) {
                            predictionChanged(likelihoodPrediction.current + '-' + value);
                        }
                    } }
                    childClass={ "justify-right" }
                    activeClass={ prediction }
                />
            </span>
            <span> </span>
            <DragDropdown 
                options={ likelihoodOptions } 
                optionSelected= { (index, value) => { 
                    likelihoodPrediction.current = value; 
                    setPrediction(value + '-' + partyPrediction.current); 

                    if (predictionChanged) {
                        predictionChanged(value + '-' + partyPrediction.current);
                    }
                } }
                activeClass={ prediction }
            />
            <span> states</span>
        </div>
    );
};