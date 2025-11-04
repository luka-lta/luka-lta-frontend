import {useQuery} from "@tanstack/react-query";
import {FetchWrapper} from "@/lib/fetchWrapper.ts";
import {trackResponse} from "@/feature/redirect/schema/ClickTrackResponseSchema.ts";

export function useTrackClick(clickTag: string) {
    const queryData = useQuery({
        queryKey: ['redirectUrl', clickTag],
        queryFn: async () => {
            let userIp = null;
            let market = null;
            try {
                const ipResponse = await fetch("https://ipwho.is/");
                if (!ipResponse.ok) {
                    throw new Error(`Failed to fetch IP: ${ipResponse.status}`);
                }
                const ipData = await ipResponse.json();
                userIp = ipData.ip;
                market = ipData.country_code;
            } catch (error) {
                console.error("Failed to fetch IP address:", error);
                // Fallback to empty IP or alternative source
            }

            const fetchWrapper = new FetchWrapper(FetchWrapper.baseUrl);
            const response = await fetchWrapper.post(`/click/track/${clickTag}`, {
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                ipAddress: userIp,
                market: market
            });

            return trackResponse.parse(response.data);
        }
    })

    return [queryData] as const;
}

