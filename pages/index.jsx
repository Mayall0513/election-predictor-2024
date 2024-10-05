import Ribbon from "../components/ribbon";

import users from '../data/users';

export default function _index({ user }) {
    return <Ribbon user={ user }/>
}

export async function getServerSideProps(context) {
    const user = await users.getUser(context);

    return {
        props: {
            user: user
        }
    };
}