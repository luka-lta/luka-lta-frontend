import { motion } from "framer-motion"
import { useLinktreeList } from "@/feature/links/hooks/useLinktreeList"
import Header from "@/components/Landing/Header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import LinkItem from "@/feature/links/components/LinkItem"
import Footer from "@/components/Landing/Footer"
import { useSetPageTitle } from "@/hooks/use-set-page-title"

function Links() {
    const [linkList] = useLinktreeList()
    useSetPageTitle("Links — Luka Dev Studio")

    const sortedLinks = linkList.data?.links
        .filter((l) => l.isActive)
        .sort((a, b) => {
            if (a.displayOrder === b.displayOrder) {
                if (a.displayOrder === 0) {
                    // @ts-ignore
                    return new Date(a.createdOn) - new Date(b.createdOn)
                }
                return 0
            }
            return a.displayOrder - b.displayOrder
        }) ?? []

    return (
        <>
            <Header />
            <main className="relative min-h-screen bg-background">
                {/* Background */}
                <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
                <div className="pointer-events-none fixed left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />

                <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center px-6 py-16">
                    {/* Profile */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10 text-center"
                    >
                        <div className="mb-6 inline-flex items-center justify-center rounded-full border-2 border-primary/30 p-1 shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
                            <Avatar className="h-20 w-20">
                                <AvatarImage
                                    src="https://avatars.githubusercontent.com/u/67432564?s=400&u=725e1ed64ea2108364b514fa74405600f168242b&v=4"
                                    alt="Luka Dev Studio"
                                />
                                <AvatarFallback className="text-xl font-bold">LL</AvatarFallback>
                            </Avatar>
                        </div>
                        <h1 className="mb-1 text-2xl font-black text-foreground">Luka Dev Studio</h1>
                        <p className="font-mono text-sm text-[hsl(var(--teal))]">Code that ships.</p>
                    </motion.div>

                    {/* Links */}
                    <div className="w-full space-y-3">
                        {linkList.isPending ? (
                            Array(4).fill(null).map((_, i) => (
                                <Skeleton key={i} className="h-[66px] w-full rounded-2xl" />
                            ))
                        ) : linkList.isError ? (
                            <p className="text-center text-sm text-destructive">{linkList.error.message}</p>
                        ) : sortedLinks.length > 0 ? (
                            sortedLinks.map((link, i) => (
                                <LinkItem key={link.id} link={link} index={i} />
                            ))
                        ) : (
                            <p className="text-center text-sm text-muted-foreground">No links found.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Links
