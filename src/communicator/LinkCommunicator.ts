import {LinkItemType} from "@/components/Links/LinkItemType.ts";

export class LinkCommunicator {
    private readonly server: string;

    constructor(server: string = `${import.meta.env.VITE_API_URL}/linkCollection`) {
        this.server = server;
    }

    async getLinks(): Promise<LinkItemType[]> {
        try {
            const response = await fetch(`${this.server}/?mustRef=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-Key': `${import.meta.env.VITE_API_KEY}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.message === 'No links found') {
                return [];
            }

            return data.links;
        } catch (error) {
            console.error('Fehler beim Abrufen der Links:', error);
            throw error;
        }
    }
}