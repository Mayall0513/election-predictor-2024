import { useState } from "react";
import html2canvas from "html2canvas";

import Ribbon from "../../components/ribbon";
import StateMap from "../../components/presidential/state_map";
import PredictionSentence from "../../components/presidential/prediction_sentence";
import ElectoralCollegeChart from "../../components/presidential/electoral_college_chart";
import Tooltip from "../../components/tooltip";

import users from '../../data/users';
import { presidentialStates } from "../../data/elections";

export default function President(props) {
    const [ currentPrediction, setCurrentPrediction ] = useState("tilt-d");
    const [ predictions, setPredictions ] = useState();
    const [ hoveredState, setHoveredState ] = useState();
    const [ tooltipContents, setTooltipContents ] = useState();

    const onStateHovered = (key) => {
        const tooltipText = presidentialStates[key].votes == 1
            ? `${presidentialStates[key].votes} electoral vote`
            : `${presidentialStates[key].votes} electoral votes`;

        setHoveredState(key);
        setTooltipContents(`${presidentialStates[key].name} (${tooltipText})`);
    }

    const onStateUnhovered = (key) => {
        setHoveredState(null);
        setTooltipContents(null);
    }

    const saveElectoralCollegeMap = async () => {
        const htmlElement = document.querySelector('#electoral-college-group');
        const canvas = await html2canvas(htmlElement, { backgroundColor: null, scale: 4 });

        canvas.toBlob(async (blob) => {
            try {
                const fileHandle = await window.showSaveFilePicker({ startIn: "downloads", suggestedName: "map", types: [{ accept: { "image/png": [ '.png' ]} }]});
                const writeHandle = await fileHandle.createWritable();
                await writeHandle.write(blob);
                await writeHandle.close();
            }

            catch ({ name }) {
                if ("AbortError" !== name) {
                    throw error;
                }
            }

        });
    }

    return (
        <>
            <Ribbon user={ props.user } />
            <PredictionSentence predictionChanged={ setCurrentPrediction } />
            <button 
                type="button" 
                onClick={ saveElectoralCollegeMap }
            >
                Save
            </button>
            <div id="electoral-college-group" className="electoral-college">
                <ElectoralCollegeChart predictions={ predictions } hoveredState={ hoveredState } />
                <StateMap currentPrediction={ currentPrediction } predictionChanged={ setPredictions } onStateHovered={ onStateHovered } onStateUnhovered={ onStateUnhovered } />
            </div>
            <Tooltip contents={ tooltipContents } />

        </>
    );
}

export async function getServerSideProps(context) {
    const user = users.getUser(context);

    return {
        props: {
            user: user
        }
    };
}