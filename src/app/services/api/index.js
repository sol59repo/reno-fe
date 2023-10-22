import { ZOOM_URL, SITE_URL } from './constants';

export const api = {
    auth: (url, body) => {
        return fetch(`${SITE_URL + url}`, {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: body,
        });
    },
    post: (url, body = {}, token = "") => {
        return fetch(`${SITE_URL + url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body,
        });
    },
    patch: (url, body, token = "") => {
        return fetch(`${SITE_URL + url}`, {
            method: 'patch',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body,
        });
    },
    delete: (url, body, token = "") => {
        return fetch(`${SITE_URL + url}`, {
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body
        });
    },
    get: (url, token = "") => {
        return fetch(`${SITE_URL + url}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
    },

    upload: (url, body = {}, token = "") => {
        return fetch(`${SITE_URL + url}`, {
            method: 'POST',
            body: body,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    },


    zoomPost: (url = "", body, user = "geviepitogo@gmail.com") => {
        url = `v2/users/${user}/meetings`

        return fetch(`${ZOOM_URL + url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IkVYQkk5aXR6UUJPLTgyNllXNWRiNHciLCJleHAiOjE2NDczNzMyMTcsImlhdCI6MTY0Njc2ODQxN30.30eCLPL2t6rU_hL2E1dCHnugb2KfptUAJvR-QLZRBW4`
            },
            body: body
        });
    }
}

