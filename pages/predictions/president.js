import Ribbon from "../../components/ribbon";
import AmericaStateMap from "../../components/america_state_map.js";

import users from '../../data/users';

export default function President(props) {
    return (
        <>
            <Ribbon user={props.user}/>
            <AmericaStateMap click={ async (id) => console.log(id) } />
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