import { useState } from "react";
import axios from "axios";

import Ribbon from "../../components/ribbon";

import users from '../../data/users';

import { useRouter } from "next/router";

export default function _sign_in({ redirect_uri, using_default_uri }) {
    const [ discordCode, setDiscordCode ] = useState(null);
    const [ errorOccured, setErrorOccured ] = useState(false);

    const router = useRouter();
    const redirect_params_oauth2 = new URLSearchParams(
        {
            redirect_uri
        }
    );

    async function discordAuthenticate() {
        const redirect_params_discord = new URLSearchParams(
            {
                code: discordCode.trim()
            }
        );

        try {
            await axios.post("/api/auth/signin/discord?" + redirect_params_discord.toString());
            router.replace(redirect_uri, undefined, { shallow: true }) 
        }

        catch (error) {
            if (400 == error.status || 401 == error.status) {
                setErrorOccured(true);
                return;
            }
            
            console.error(error);
        }
    }

    return (
        <>
            <Ribbon signinPage={ true } redirect={ !using_default_uri && redirect_uri } />
            <button 
                type="button"
                onClick={ () => router.replace("/api/auth/signin/oauth2?" + redirect_params_oauth2.toString(), undefined, { shallow: true }) }>
                Sign in with Discord
            </button>
            <p>
                <label htmlFor="discord-code-box">Or use an authentication code: </label>
            </p>
            <span>
                    <input
                        id="discord-code-box"
                        type="text"
                        className={ errorOccured ? "validation-error" : null }
                        onChange={ (e) => setDiscordCode(e.target.value) }
                    />
                    <button 
                        type="button"
                        onClick={ discordAuthenticate }
                        disabled={ discordCode && discordCode.length == 5 ? false : true }>
                        Sign in
                    </button>
                </span>
        </>
    );
}

export async function getServerSideProps(context) {
    const user = await users.getUser(context);

    const redirect_uri = context.query.redirect_uri
        ? context.query.redirect_uri
        : "/";

    const using_default_uri = !context.query.redirect_uri;

    if (user) {
        return {
            redirect: {
                destination: redirect_uri,
                permanent: true
            }
        };
    }

    return {
        props: {
            redirect_uri,
            using_default_uri
        }
    };
}