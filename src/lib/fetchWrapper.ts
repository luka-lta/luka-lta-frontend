import {ApiResponseSchema, ApiSchema} from "@/lib/ApiSchema.ts";

export class FetchWrapper {
    private readonly baseUrl: string;
    static baseUrl: string;
    static routes: Record<string, string>;

    static {
        this.baseUrl = import.meta.env.VITE_API_URL;
        this.routes = {
            login: import.meta.env.VITE_API_LOGIN_ROUTE,
        };
    }

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request(
        endpoint: string,
        method: string,
        body?: unknown,
        headers: HeadersInit = {}
    ): Promise<ApiSchema> {
        const apiKey = import.meta.env.VITE_API_KEY;
        const config: RequestInit = {
            method,
            headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);

            if (response.status > 400) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();

            return ApiResponseSchema.parse(data);
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    get(endpoint: string, headers?: HeadersInit): Promise<ApiSchema> {
        return this.request(endpoint, 'GET', undefined, headers);
    }

    post(endpoint: string, body?: unknown, headers?: HeadersInit): Promise<ApiSchema> {
        return this.request(endpoint, 'POST', body, headers);
    }

    put(endpoint: string, body: unknown, headers?: HeadersInit): Promise<ApiSchema> {
        return this.request(endpoint, 'PUT', body, headers);
    }

    delete(endpoint: string, headers?: HeadersInit): Promise<ApiSchema> {
        return this.request(endpoint, 'DELETE', undefined, headers);
    }
}