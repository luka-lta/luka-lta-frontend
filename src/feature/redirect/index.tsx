import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTrackClick } from "@/feature/redirect/hooks/useTrackClick.tsx";

function RedirectLink() {
    const params = useParams();
    const initialDelay = 5;
    const clickTag = params.clickTag as unknown as string;
    const [{ data: targetUrl, isLoading, isError }] = useTrackClick(clickTag);

    const [timeLeft, setTimeLeft] = useState(initialDelay);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!targetUrl?.redirectUrl) return;
        console.log(targetUrl);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.replace(targetUrl.redirectUrl);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetUrl]);

    useEffect(() => {
        setProgress((timeLeft / initialDelay) * 100);
    }, [timeLeft]);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (isError) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">An error occurred</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/50 p-4">
            <Card className="w-full max-w-md shadow-lg border-muted">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-center">Redirecting...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pb-6">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                                <svg className="absolute w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        strokeDasharray="364.4"
                                        strokeDashoffset={364.4 - (364.4 * progress) / 100}
                                        className="text-primary transition-all duration-1000 ease-in-out"
                                    />
                                </svg>
                                <div className="z-10 flex flex-col items-center">
                                    <span className="text-4xl font-bold">{timeLeft}</span>
                                    <span className="text-xs text-muted-foreground">seconds</span>
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-muted-foreground flex items-center gap-1.5">
                            <Clock className="h-4 w-4"/>
                            Redirecting to new page
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </div>
    );
}

export default RedirectLink;
