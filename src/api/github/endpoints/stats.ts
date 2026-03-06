export type RepoStatsResponse = {
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string|null;
}

export async function fetchStats(
    owner: string,
    repo: string
): Promise<RepoStatsResponse> {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
            method: 'GET',
        }
    )

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}
