import {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Navbar} from "@/components/Navbar.tsx";
import {Footer} from "@/components/Footer.tsx";
import LinkItem from "@/components/Links/LinkItem.tsx";
import StarBackground from "@/components/StarBackground.tsx";
import {LinkItemType} from "@/components/Links/LinkItemType.ts";
import {LinkCommunicator} from "@/communicator/LinkCommunicator.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";

export default function LinksPage() {
    const [links, setLinks] = useState<LinkItemType[]>([]); // Initialisierung als leeres Array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLinks = async () => {
            const communicator = new LinkCommunicator();
            try {
                const data = await communicator.getLinks();

                if (Array.isArray(data)) {
                    setLinks(data);
                } else {
                    throw new Error("Antwort ist kein Array");
                }
            } catch (err: any) {
                setError("Fehler beim Laden der Links. Bitte versuche es später erneut.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    return (
        <>
            <StarBackground/>
            <Navbar/>
            <div
                className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center p-6 space-y-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage
                                src="https://avatars.githubusercontent.com/u/67432564?s=400&u=725e1ed64ea2108364b514fa74405600f168242b&v=4"
                                alt="Luka.lta"
                            />
                            <AvatarFallback>LL</AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl font-bold text-center">Luka Liebenthal</h1>
                        <p className="text-center text-muted-foreground">Full Stack Developer | Tech Enthusiast</p>

                        <div className="w-full space-y-4">
                            {loading ? (
                                <>
                                    {Array(5).fill(null).map((_, index) => (
                                        <Skeleton key={index} className="w-full h-16 flex items-center space-x-4 rounded-md p-4">
                                            <Skeleton className="w-8 h-8 rounded-full" />
                                            <div className="flex flex-col space-y-2 w-full">
                                                <Skeleton className="w-2/3 h-5" />
                                                <Skeleton className="w-1/2 h-4" />
                                            </div>
                                        </Skeleton>
                                    ))}
                                </>
                            ) : error ? (
                                <p className="text-center text-red-500">{error}</p>
                            ) : links.length > 0 ? (
                                links
                                    .sort((a, b) => {
                                        if (a.displayOrder === b.displayOrder) {
                                            // Wenn displayOrder gleich ist und 0, sortiere nach createdOn
                                            if (a.displayOrder === 0) {
                                                // @ts-ignore
                                                return new Date(a.createdOn) - new Date(b.createdOn);
                                            }
                                            return 0;
                                        }
                                        return a.displayOrder - b.displayOrder;
                                    })
                                    .map((link) => (
                                        <LinkItem
                                            id={link.id}
                                            // @ts-ignore
                                            key={link.id}
                                            // @ts-ignore
                                            linkId={link.id}
                                            displayname={link.displayname}
                                            description={link.description}
                                            url={link.url}
                                            createdOn={link.createdOn}
                                            isActive={link.isActive}
                                            iconName={link.iconName}
                                            displayOrder={link.displayOrder}
                                        />
                                    ))
                            ) : (
                                <p className="text-center text-muted-foreground">Keine Links gefunden</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer/>
        </>
    );
}
