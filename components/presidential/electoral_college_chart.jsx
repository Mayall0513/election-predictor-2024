import React from "react";

import { totalElectoralCollegeVotes, presidentialStatesKeys, predictionEnumeration } from "../../data/elections";

export default function _electoralCollegeChart({ predictions, hoveredState }) {
    const predictionsMetadata = {
        d: 0,
        r: 0
    };

    for (const prediction of predictionEnumeration) {
        predictionsMetadata[prediction] = 0;
    }

    const renderGroups = {
        d: {
           safe: [],
           likely: [],
           lean: [],
           tilt: []
        },
        r: {
            tilt: [],
            lean: [],
            likely: [],
            safe: []
        }
    };

    if (predictions) {
        for (const state in predictions) {
            const { prediction, votes } = predictions[state];
            const [ _, party ] = prediction.split('-');

            predictionsMetadata[prediction] += votes;
            predictionsMetadata[party] += votes;
        }

        for (const state of presidentialStatesKeys) {
            if (!predictions[state]) {
                continue;
            }

            const { prediction, votes } = predictions[state];
            const [ strength, party ] = prediction.split('-');
            
            const width = Math.round((votes / predictionsMetadata[prediction]) * 10000) / 100;
            const style = { width: `${width}%` };

            if (hoveredState && state === hoveredState) {
                renderGroups[party][strength].push(
                    <div
                        className={ `chart-element ${prediction}` }
                        key={ `element_${state}` }
                        style={ style }
                    />
                );
            }

            else {
                if (hoveredState) {
                    renderGroups[party][strength].push(
                        <div
                            className="chart-element chart-element-blur"
                            key={ `element_${state}` }
                            style={ style }
                        />
                    );
                }

                else {
                    renderGroups[party][strength].push(
                        <div
                            className="chart-element"
                            key={ `element_${state}` }
                            style={ style }
                        />
                    ); 
                }

            }
        }
    }

    for (const index in renderGroups) {
        const renderSubGroups = [];

        for (const predictionStrength in renderGroups[index]) {
            const prediction = `${predictionStrength}-${index}`;

            const width = Math.round((predictionsMetadata[prediction] / predictionsMetadata[index]) * 10000) / 100;
            const style = { width: `${width}%` };

            if (hoveredState) {
                renderSubGroups.push(
                    <div 
                        className={ `chart-subgroup chart-subgroup-blur ${prediction}` }
                        key={ `subgroup_${prediction}` }
                        style={ style }
                    >
                        { renderGroups[index][predictionStrength] }
                    </div>
                );
            }

            else {
                renderSubGroups.push(
                    <div 
                        className={ `chart-subgroup ${prediction}` }
                        key={ `subgroup_${prediction}` }
                        style={ style }
                    >
                        { renderGroups[index][predictionStrength] }
                    </div>
                );
            }
        }

        const width = Math.round((predictionsMetadata[index] / totalElectoralCollegeVotes) * 10000) / 100;
        const style = { width: `${width}%` };


        renderGroups[index] = (
            <div
                className="chart-group"
                key={ `group_${index}` }
                style={ style }
            >
                { renderSubGroups }
            </div>
        );
    }

    return (
        <div className="electoral-college-chart">
            { Object.values(renderGroups) }
            <div className="chart-center-indicator" />
        </div>
    );
};