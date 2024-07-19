import { useState } from "react";

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
    const [ tooltipContents, setTooltipContents ] = useState();

    const onStateHovered = (key) => {
        setTooltipContents(`${presidentialStates[key].name} (${presidentialStates[key].votes})`);
    }

    const onStateUnhovered = (key) => {
        setTooltipContents(null);
    }

    return (
        <>
            <Ribbon user={ props.user } />
            <Tooltip contents={ tooltipContents } />
            <PredictionSentence predictionChanged={ setCurrentPrediction } />
            <div className="electoral-college">
                <ElectoralCollegeChart predictions={ predictions } />
                <StateMap currentPrediction={ currentPrediction } predictionChanged={ setPredictions } onStateHovered={ onStateHovered } onStateUnhovered={ onStateUnhovered } />
            </div>
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