import Ribbon from "../../components/ribbon";
import AmericaStateMap from "../../components/america_state_map.js";

import users from '../../data/users';

export default function President(props) {
    return (
        <>
            <Ribbon user={props.user}/>
            <AmericaStateMap />
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