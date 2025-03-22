import {useLinktreeList} from "@/feature/links/hooks/useLinktreeList.tsx";
import Header from "@/components/Landing/Header.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import LinkItem from "@/feature/links/components/LinkItem.tsx";
import Footer from "@/components/Landing/Footer.tsx";

function Links() {
    const [linkList] = useLinktreeList();

    return (
        <>
            <Header/>
            <div
                className="min-h-screen bg-gradient-to-b text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4">
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
                            {linkList.isPending ? (
                                <>
                                    {Array(5).fill(null).map((_, index) => (
                                        <Skeleton key={index}
                                                  className="w-full h-16 flex items-center space-x-4 rounded-md p-4">
                                            <Skeleton className="w-8 h-8 rounded-full"/>
                                            <div className="flex flex-col space-y-2 w-full">
                                                <Skeleton className="w-2/3 h-5"/>
                                                <Skeleton className="w-1/2 h-4"/>
                                            </div>
                                        </Skeleton>
                                    ))}
                                </>
                            ) : linkList.isError ? (
                                <p className="text-center text-red-500">{linkList.error.message}</p>
                            ) : linkList.data.links.length > 0 ? (
                                linkList.data.links
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
                                            key={link.id}
                                            link={link}
                                        />
                                    ))
                            ) : (
                                <p className="text-center text-red-500">No links found!</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer/>
        </>
    );
}

export default Links;