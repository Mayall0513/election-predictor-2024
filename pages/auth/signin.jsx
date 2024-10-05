import { useState } from "react";
import axios from "axios";

import Ribbon from "../../components/ribbon";

import users from '../../data/users';

import { useRouter } from "next/router";

export default function _sign_in({ redirect_uri, using_default_uri }) {
    const [ discordCode, setDiscordCode ] = useState(null);

    const router = useRouter();
    const redirect_params_oauth2 = new URLSearchParams(
        {
            redirect_uri
        }
    );

    async function discordAuthenticate() {
        const redirect_params_discord = new URLSearchParams(
            {
                code: discordCode
            }
        );

        console.log('123');

        try {
            const response = await axios.post("/api/auth/signin/discord?" + redirect_params_discord.toString());

            /**
             * Bad code
             */
            if (400 == response.code || 401 == response.code) {
                /**
                 * Show some kind of validation
                 */
                return;
            }

            /**
             * Internal error
             */
            if (500 == response.code) {
                /**
                 * Show some kind of error
                 */
                return;
            }

            router.replace(redirect_uri, undefined, { shallow: true }) 
        }

        catch (error) {
            console.error(error);
        }
        // 
    }

    return (
        <>
            <Ribbon signinPage={ true } redirect={ !using_default_uri && redirect_uri } />
            <button 
                type="button" 
                className="link-button justify-right"
                onClick={ () => router.replace("/api/auth/signin/oauth2?" + redirect_params_oauth2.toString(), undefined, { shallow: true }) }>
                Sign in with Discord
            </button>
            <p>Or use a authentication code: </p>
            <span>
                <input 
                    type="text" 
                    onChange={ (e) => setDiscordCode(e.target.value) }
                />
                <button 
                    type="button" 
                    className="link-button justify-right"
                    onClick={ discordAuthenticate }>
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