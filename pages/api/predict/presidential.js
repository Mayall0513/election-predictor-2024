import fsp from 'node:fs/promises';

import axios from 'axios';
import { IncomingForm } from 'formidable';

import helpers from '../../../helpers/api_helpers';

export default async function presidential(req, res) {
    if (req.method != "POST") {
        res.status(400).json("bad request");
        return;
    }

    const dirtyForm = new IncomingForm();
    const [ { payload }, { image } ] = await dirtyForm.parse(req);
    if (!payload || !image) {
        res.status(400).json("bad request");
        return;
    }

    const dirtyPayload = JSON.parse(payload);
    if (!dirtyPayload.metadata || !dirtyPayload.states) {
        res.status(400).json("bad request");
        return;
    }

    const authCookie = helpers.getCookie(req, process.env.AUTH_COOKIE_NAME);
    if (!authCookie) {
        res.status(401).json("unauthorized");
        return;
    }

    const cleanPayload = {};
    cleanPayload['metadata'] = {};

    if (dirtyPayload.metadata.winner) {
        cleanPayload.metadata.winner = dirtyPayload.metadata.winner;
    }

    if (dirtyPayload.metadata.r) {
        cleanPayload.metadata.r = dirtyPayload.metadata.r;
    }

    if (dirtyPayload.metadata.d) {
        cleanPayload.metadata.d = dirtyPayload.metadata.d;
    }

    cleanPayload.states = {};
    for (const state in dirtyPayload.states) {
        const data = dirtyPayload.states[state];

        cleanPayload.states[state] = {
            winner: data['winner'],
            strength: data['strength'],
            votes: data['votes']
        };
    }

    const imageBuffer = await fsp.readFile(image[0].filepath);
    const imageBlob = new Blob([ imageBuffer ]);

    const cleanForm = new FormData();

    cleanForm.append('payload', JSON.stringify(cleanPayload));
    cleanForm.append('image', imageBlob);

    try {
        await axios.post(
            process.env.BACKEND_URI + "/President",
            cleanForm,
            {
                headers: {
                    cookie: process.env.AUTH_COOKIE_NAME + "=" + authCookie + ";"
                }
            }
        )
    }

    catch (error) {
        if (error.response.status == "401") {
            res.status(401).json("unauthorized");
            return;
        }

        res.status(500).json("internal error");
        return;
    }

    res.status(200).json("posted");
};

export const config = {
    api: {
        bodyParser: false,
    }
};