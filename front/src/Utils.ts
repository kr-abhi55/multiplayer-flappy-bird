import { v4 as uuid4 } from 'uuid';

export namespace Utils {
    export const env = {
        SERVER_URL: (import.meta as any).env.VITE_SERVER_URL,
        SOCKET_URL: (import.meta as any).env.VITE_SOCKET_URL,
    }
    const SERVER_URL = env.SERVER_URL
    export async function getJson(url: string, query: string = "") {

        var requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow'
        };
        try {
            const result = await fetch(`${SERVER_URL}${url}${query.length == 0 ? '' : ('?' + query)}`, requestOptions)
            return await result.json()
        } catch (error) {
            alert(error)
            return { error }
        }
    }
    export function generateID() {
        return uuid4()
    }
}

export interface Player {
    isHost: boolean,
    name: string,
    playerID: string
    roomID: string
}
export interface GameObject {
    id: string,
    x: number,
    y: number,
    color: string,
}