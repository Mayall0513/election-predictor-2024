import { useState } from "react";

import Ribbon from "../../components/ribbon";
import AmericaStateMap from "../../components/america_state_map";
import PredictionSentence from "../../components/prediction_sentence";

import users from '../../data/users';

export default function President(props) {
    const [ currentPrediction, setCurrentPrediction ] = useState("tilt-d");

    return (
        <>
            <Ribbon user={props.user}/>
            <AmericaStateMap currentPrediction={ currentPrediction } />
            <PredictionSentence predictionChanged={ setCurrentPrediction }/>
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