import React from "react";
import Image from "next/image";

import { useRouter } from "next/router";
import { usePathname } from 'next/navigation'

export default function _ribbon({ user }) {
    const router = useRouter();
    const pathname = usePathname();

    const redirectParams = new URLSearchParams(
        {
            redirect_uri: pathname
        }
    );

    return (
        <div className="ribbon-container">
            <div className="ribbon">
                <div className="ribbon-item account-section"> 
                    { user ?
                        <>
                            <div className="account-details-section">
                                { user.username }
                                <button 
                                    type="button" 
                                    className="link-button"
                                    onClick={(e) => router.replace("/api/auth/signout?" + redirectParams.toString(), undefined, { shallow: true }) }>
                                    Sign out
                                </button>
                            </div>
                            <Image className="avatar" alt="User avatar" width="64" height="64" src={ user.avatar_url } />
                        </> :
                        <button 
                            type="button" 
                            className="link-button"
                            onClick={(e) => router.replace("/api/auth/signin?" + redirectParams.toString(), undefined, { shallow: true }) }>
                            Sign in
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};