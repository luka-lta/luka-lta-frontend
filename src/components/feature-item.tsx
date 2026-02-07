import {cn} from "@/lib/utils.ts";
import { motion } from "framer-motion";

export interface FeatureItemProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    position: string;
    delay: number;
}

export function FeatureItem({
                         title,
                         description,
                         icon,
                         color,
                         position,
                         delay,
                     }: FeatureItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className={cn(
                "absolute z-10 pointer-events-auto",
                position
            )}
        >
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-3 bg-background/80 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-lg max-w-[150px] md:max-w-[200px]"
            >
                <div
                    className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center text-white shrink-0",
                        color
                    )}
                >
                    {icon}
                </div>
                <div>
                    <h4 className="font-medium text-xs md:text-sm">{title}</h4>
                    <p className="text-[0.7rem] md:text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}