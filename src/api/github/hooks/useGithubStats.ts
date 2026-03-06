import {useQuery} from "@tanstack/react-query";
import {fetchStats} from "@/api/github/endpoints/stats.ts";

export function useGithubStats(
    owner: string,
    repo: string,
) {
    return useQuery({
        queryKey: ['github-stats', owner, repo],
        queryFn: () => fetchStats(owner, repo),
        staleTime: 60_000,
        enabled: !!owner && !!repo,
    })
}
