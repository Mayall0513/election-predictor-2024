import users from '../data/users';
import Ribbon from "../components/ribbon";

export default function Index(props) {
    return (
        <>
            <Ribbon user={props.user}/>
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