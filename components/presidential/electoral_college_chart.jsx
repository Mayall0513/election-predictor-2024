import React from "react";

import { totalElectoralCollegeVotes, predictionEnumeration } from "../../data/elections";

const partyOrder = [
    'd',
    'o',
    'r'
];

export default function ElectoralCollegeChart({ predictions }) {
    const distribution = {};
    for (const prediction of predictionEnumeration) {
        const predictionParty = prediction.split('-')[1];
        let totalVotes = 0;

        if (predictions && predictions[prediction]) {
            for (const state of predictions[prediction]) {
                totalVotes += state.votes;
            }
        }

        if (!distribution[predictionParty]) {
            distribution[predictionParty] = [];
        }

        distribution[predictionParty].push({
            total: totalVotes,
            prediction,
        });
    }

    const distributionGroups = [];
    for (const group of partyOrder) {
        let groupContent = [];
        let groupVotes = 0;

        if (distribution[group]) {
            for (const { total } of distribution[group]) {
                groupVotes += total;
            }

            for (const { total, prediction } of distribution[group]) {
                const percentage = Math.round((total / groupVotes) * 100000) / 1000;

                /**
                 * Other must be handled discretely since it is in the centre
                 * 
                 * tilt/2 lean/2 likely/2 safe likely/2 lean/2 tilt/2
                 */
                if ('o' === group && 'safe-o' !== prediction) {
                    groupContent.unshift(
                        (
                            <div
                                className={ `electoral-college-chart-element ${prediction}` }
                                key={ `chart_element_${prediction}_0` }
                                style={{ width: `${percentage / 2}%` }}
                            />
                        )
                    );

                    groupContent.push(
                        (
                            <div
                                className={ `electoral-college-chart-element ${prediction}` }
                                key={ `chart_element_${prediction}_1` }
                                style={{ width: `${percentage / 2}%` }}
                            />
                        )
                    );
                }

                else {
                    groupContent.push(
                        (
                            <div
                                className={ `electoral-college-chart-element ${prediction}` }
                                key={ `chart_element_${prediction}` }
                                style={{ width: `${percentage}%` }}
                            />
                        )
                    );
                }
            }
        }

        const percentage = Math.round((groupVotes / totalElectoralCollegeVotes) * 100000) / 1000;
        const styles = { width: `${percentage}%` };
        
        distributionGroups.push(
            <div 
                className={ `electoral-college-chart-group ${group}` }
                style={ styles }
                key={ `chart_group_${group}` }
            >
                { groupContent }
            </div>
        );
    }

    return (
        <div className="electoral-college-chart">
            { distributionGroups }
            <div className="electoral-college-chart-center-indicator" />
        </div>
    );
};