import Ribbon from "../components/ribbon";

import users from '../data/users';

export default function Index(props) {
    return (
        <Ribbon user={props.user}/>
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