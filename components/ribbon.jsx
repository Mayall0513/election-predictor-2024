import React from "react";
import Image from "next/image";

import { useRouter } from "next/router";
import { usePathname } from 'next/navigation'
import Link from "next/link";

export default function _ribbon({ user, signinPage, redirect }) {
    const router = useRouter();
    const pathname = usePathname();

    const redirect_params = new URLSearchParams(
        {
            redirect_uri: pathname
        }
    );

    const ribbon_items = [];

    if (user) {
        ribbon_items.push(
            <div className="ribbon-item ribbon-item-left ribbon-item-large" key="left">
                <Image className="avatar" alt="User avatar" width="64" height="64" src={ user.avatar_url } />
                { user.username }
            </div>
        );

        ribbon_items.push(
            <div className="ribbon-item ribbon-item-centre" key="centre">
                <Link className="ribbon-item-link" href="/predictions/presidential">Presidential</Link>
                {/* <Link href="/predictions/senatorial">Senatorial</Link> */}
            </div>
        );

        ribbon_items.push(
            <div className="ribbon-item ribbon-item-right" key="right">
                <button
                    type="button" 
                    className="link-button justify-right"
                    onClick={(e) => router.replace("/api/auth/signout?" + redirect_params.toString(), undefined, { shallow: true }) }>
                    Sign out
                </button>
            </div>
        );
    }

    else {
        ribbon_items.push(
            <div className="ribbon-item ribbon-item-left" key="left"></div>
        );

        ribbon_items.push(
            <div className="ribbon-item ribbon-item-centre" key="centre">
                <Link className="ribbon-item-link" href="/predictions/presidential">Presidential</Link>
                {/* <Link href="/predictions/senatorial">Senatorial</Link> */}
            </div>
        );

        if (signinPage) {
            if (redirect) {
                ribbon_items.push(
                    <div className="ribbon-item ribbon-item-right" key="right">
                        <button 
                            type="button" 
                            className="link-button"
                            onClick={(e) => router.replace(redirect, undefined) }>
                            Go back
                        </button>
                    </div>
                );
            }

            else {
                ribbon_items.push(<div className="ribbon-item ribbon-item-right" key="right"></div>);
            }
        }

        else {
            ribbon_items.push(
                <div className="ribbon-item ribbon-item-right" key="right">
                    <button 
                        type="button" 
                        className="link-button"
                        onClick={(e) => router.replace("/auth/signin?" + redirect_params.toString(), undefined, { shallow: true }) }>
                        Sign in
                    </button>
                </div>
            );
        }
    }

    return (
        <div className="ribbon-container">
            <div className="ribbon">
                { ribbon_items }
            </div>
        </div>
    );
};