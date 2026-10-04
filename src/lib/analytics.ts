type FlowtixWindow = Window & {
    flowtix?: {
        event: (name: string, props?: Record<string, unknown>) => void
        pageview: () => void
        trackOutbound: (url: string, text?: string, target?: string) => void
    }
}

export const track = (event: string, props?: Record<string, unknown>) => {
    (window as FlowtixWindow).flowtix?.event(event, props)
}
