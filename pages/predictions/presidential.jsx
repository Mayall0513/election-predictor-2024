import { useRef, useState } from "react";

import Ribbon from "../../components/ribbon";
import StateMap from "../../components/presidential/state_map";
import PredictionSentence from "../../components/presidential/prediction_sentence";
import ElectoralCollegeChart from "../../components/presidential/electoral_college_chart";

import users from '../../data/users';

export default function President(props) {
    const [ currentPrediction, setCurrentPrediction ] = useState("tilt-d");
    const [ predictions, setPredictions ] = useState();

    return (
        <>
            <Ribbon user={ props.user } />
            <PredictionSentence predictionChanged={ setCurrentPrediction } />
            <div>
                <ElectoralCollegeChart predictions={ predictions } />
                <StateMap currentPrediction={ currentPrediction } predictionChanged={ setPredictions } />
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