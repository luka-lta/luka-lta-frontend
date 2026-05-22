import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import * as Icons from "react-icons/fa"
import { LinkItemTypeSchema } from "@/feature/links/schema/linktreeSchema"

interface LinkItemProps {
    link: LinkItemTypeSchema
    index: number
}

// @ts-ignore
const CustomFaIcon = ({ name }) => {
    // @ts-ignore
    const FaIcon = Icons[name as keyof Icons]
    if (!FaIcon) return null
    return <FaIcon className="h-4 w-4" />
}

function LinkItem({ link, index }: LinkItemProps) {
    if (!link.isActive) return null

    return (
        <motion.a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group flex w-full items-center gap-4 rounded-2xl border border-border/60 bg-card px-5 py-4 transition-colors hover:border-primary/50 hover:bg-card"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                <CustomFaIcon name={link.iconName} />
            </div>
            <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{link.displayname}</p>
                {link.description && (
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                )}
            </div>
            <ArrowRight className="h-4 w-4 translate-x-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
        </motion.a>
    )
}

export default LinkItem
