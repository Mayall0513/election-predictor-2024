import React from "react";

import { useRouter } from "next/router";

export default function Ribbon({ user }) {
    const router = useRouter();

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
                                    onClick={(e) => router.replace("/api/auth/signout", undefined, { shallow: true }) }>
                                    Sign out
                                </button>
                            </div>
                            <img className="avatar" width="64" height="64" src={user.avatar_url}/>
                        </> :
                        <button 
                            type="button" 
                            className="link-button"
                            onClick={(e) => router.replace("/api/auth/signin", undefined, { shallow: true }) }>
                            Sign in
                        </button>
                    }
                </div>
            </div>
        </div>
    )
};