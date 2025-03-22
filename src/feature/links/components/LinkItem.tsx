import {Button} from "@/components/ui/button.tsx";
import * as Icons from "react-icons/fa";
import {LinkItemTypeSchema} from "@/feature/links/schema/linktreeSchema.ts";

interface LinkItemProps {
    link: LinkItemTypeSchema;
}

function LinkItem({link}: LinkItemProps) {
    if (!link.isActive) {
        return null;
    }
    // @ts-ignore
    const CustomFaIcon = ({ name }) => {
        // @ts-ignore
        const FaIcon = Icons[name as keyof Icons];
        if (!FaIcon) return <p>Icon not found!</p>;

        return <FaIcon />;
    };

    return (
        <Button
            variant="outline"
            className="w-full justify-start h-auto py-3 px-4"
            asChild
        >
            <a href={link.url} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-start">
                        <span className="font-medium">{link.displayname}</span>
                        {link.description && (
                            <span
                                className="text-sm text-muted-foreground">{link.description}</span>
                        )}
                        <CustomFaIcon name={link.iconName} />
                    </div>
                </div>
            </a>
        </Button>
    );
}

export default LinkItem;