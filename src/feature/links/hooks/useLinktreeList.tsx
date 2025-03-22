import {useQuery} from "@tanstack/react-query";
import {FetchWrapper} from "@/lib/fetchWrapper.ts";
import {linkListSchema} from "@/feature/links/schema/linktreeSchema.ts";

export function useLinktreeList() {
    const queryData = useQuery({
        queryKey: ['linktree', 'list'],
        queryFn: async () => {
            const fetchWrapper = new FetchWrapper(FetchWrapper.baseUrl);
            const response = await fetchWrapper.get(`/linkCollection/?mustRef=true`);

            return linkListSchema.parse(response.data);
        }
    })

    return [queryData] as const;
}