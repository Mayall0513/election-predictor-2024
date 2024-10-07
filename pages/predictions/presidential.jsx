import { useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

import Ribbon from "../../components/ribbon";
import StateMap from "../../components/presidential/state_map";
import PredictionSentence from "../../components/presidential/prediction_sentence";
import ElectoralCollegeChart from "../../components/presidential/electoral_college_chart";
import Tooltip from "../../components/tooltip";

import users from '../../data/users';
import { presidentialStates } from "../../data/elections";

import helpers from '../../helpers/api_helpers';

import { predictionMap } from "../../data/elections";

export default function _presidential(props) {
    const { user, previousPrediction } = props;
    
    const [ currentPrediction, setCurrentPrediction ] = useState("tilt-d");
    const [ predictions, setPredictions ] = useState();
    const [ hoveredState, setHoveredState ] = useState();
    const [ tooltipContents, setTooltipContents ] = useState();

    if (!user) {
        return (
            <>
                <Ribbon />
                <p>Please sign in</p>
            </>
        );
    }

    if (!user.on_correct_server) {
        return (
            <>
                <Ribbon user = { user }/>
                <p>Please join r/Conservative</p>
            </> 
        );
    }

    const startPredictions = {};
    const mapStartPredictions = {};

    if (previousPrediction && previousPrediction.states) {
        for (const state in previousPrediction.states) {
            const { winner, strength, votes } = previousPrediction.states[state];
            const prediction = `${strength}-${winner}`;

            startPredictions[state] = {
                prediction,
                votes
            };

            mapStartPredictions[state] = predictionMap[prediction];
        }

        if (!predictions) {
            setPredictions(startPredictions);
        }
    }

    const onStateHovered = (key) => {
        const tooltipText = presidentialStates[key].votes == 1
            ? `${presidentialStates[key].votes} electoral vote`
            : `${presidentialStates[key].votes} electoral votes`;

        setHoveredState(key);
        setTooltipContents(
            <div className="tooltip-text">
                { `${presidentialStates[key].name} (${tooltipText})` }
            </div>
        );
    }

    const onStateUnhovered = (key) => {
        setHoveredState(null);
        setTooltipContents(null);
    }

    const saveElectoralCollegeMap = async () => {
        const htmlElement = document.querySelector('#electoral-college-group');
        const htmlElementClone = htmlElement.cloneNode(true);
        htmlElementClone.setAttribute("style", "position:absolute;top:-6200px;left:-10000px;");

        /**
         * Convert time to EST
         */
        const datetimeOptions = {
            timeZone: "America/New_York",
            dateStyle: "long",
            timeStyle: "long"
        };

        const date = Date.now();
        const datetimeFormatter = new Intl.DateTimeFormat("en-US", datetimeOptions);

        const watermarkContainer = document.createElement("p");
        watermarkContainer.setAttribute("style", "color:black;font-size:8px;margin-top:0px;");

        const watermark = document.createTextNode(`${user.id} ${user.username} ${datetimeFormatter.format(date)} discord.gg/conservative`);
        watermarkContainer.appendChild(watermark);

        htmlElementClone.appendChild(watermarkContainer);
        document.body.appendChild(htmlElementClone);

        const canvas = await html2canvas(htmlElementClone, { backgroundColor: null, scale: 4 });
        const data = {
            metadata: {
                winner: null
            },
            states: {}
        };

        if (predictions) {
            for (const state in predictions) {
                const { prediction, votes } = predictions[state];
                const [ strength, winner ] = prediction.split('-', 2);
                
                if (!data['metadata'][winner]) {
                    data['metadata'][winner] = 0;
                }

                data['metadata'][winner] += votes;
                if (data['metadata'][winner] > 269) {
                    data['metadata']['winner'] = winner;
                }

                data['states'][state] = {
                    winner,
                    strength,
                    votes
                };
            }

            canvas.toBlob(async (blob) => {
                const form = new FormData();
    
                form.append('payload', JSON.stringify(data));
                form.append('image', blob);
    
                try {
                    await axios.post(
                        '/api/predict/presidential', 
                        form,
                        {
                            withCredentials: true
                        }
                    );
                }
    
                catch (error) {
                    console.error(error);
                }
            }, 'image/png', 1);
        }

        document.body.removeChild(htmlElementClone);
    }

    return (
        <>
            <Ribbon user={ user } />
            <PredictionSentence predictionChanged={ setCurrentPrediction } setTooltip={ setTooltipContents } />
            { user && (
                <button type="button" onClick={ saveElectoralCollegeMap }>Save</button>
            )}
            <Tooltip contents={ tooltipContents } />
            <div id="electoral-college-group" className="state-map-container">
                <ElectoralCollegeChart predictions={ predictions } hoveredState={ hoveredState } />
                <StateMap states={ presidentialStates } startPrediction={ mapStartPredictions } currentPrediction={ currentPrediction } predictionChanged={ setPredictions } onStateHovered={ onStateHovered } onStateUnhovered={ onStateUnhovered } />
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { req } = context;

    const user = await users.getUser(context);
    const tokenCookie = helpers.getCookie(req, process.env.AUTH_COOKIE_NAME);

    let previousPrediction = null;

    try {
        const { data: serverPreviousPrediction } = await axios.get(
            process.env.BACKEND_URI + "/President",
            {
                headers: {
                    cookie: process.env.AUTH_COOKIE_NAME + "=" + tokenCookie + ";"
                }
            }
        );

        if (serverPreviousPrediction) {
            previousPrediction = serverPreviousPrediction;
        }
    }

    catch (error) {
        console.error(error);
    }

    return {
        props: {
            user,
            previousPrediction
        }
    };
}