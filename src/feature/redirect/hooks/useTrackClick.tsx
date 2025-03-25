import {useQuery} from "@tanstack/react-query";
import {FetchWrapper} from "@/lib/fetchWrapper.ts";
import {trackResponse} from "@/feature/redirect/schema/ClickTrackResponseSchema.ts";

export function useTrackClick(clickTag: string) {
    const queryData = useQuery({
        queryKey: ['redirectUrl', clickTag],
        queryFn: async () => {
            const ipResponse = await fetch("https://api.ipify.org/?format=json");
            const ipData = await ipResponse.json();
            const userIp = ipData.ip;

            const fetchWrapper = new FetchWrapper(FetchWrapper.baseUrl);
            const response = await fetchWrapper.post(`/click/track/${clickTag}`, {
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                ipAddress: userIp,
            });

            return trackResponse.parse(response.data);
        }
    })

    return [queryData] as const;
}

