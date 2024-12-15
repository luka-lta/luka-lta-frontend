import {LinkItemType} from "@/components/Links/LinkItemType.ts";

export class LinkCommunicator {
    private readonly server: string;

    constructor(server: string = 'http://localhost/api/v1/linkCollection') {
        this.server = server;
    }

    async getLinks(): Promise<LinkItemType[]> {
        try {
            const response = await fetch(`${this.server}/links?mustRef=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // Setzt den Header
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data.links;
        } catch (error) {
            console.error('Fehler beim Abrufen der Links:', error);
            throw error;
        }
    }
}