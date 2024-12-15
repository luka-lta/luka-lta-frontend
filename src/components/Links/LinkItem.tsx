import {LinkItemType} from "@/components/Links/LinkItemType.ts";
import {Button} from "@/components/ui/button.tsx";
import * as Icons from "react-icons/fa";

function LinkItem(props: LinkItemType) {
    const {id, displayname, description, url, isActive, iconName} = props;

    if (!isActive) {
        return null;
    }
    // @ts-ignore
    const CustomFaIcon = ({ name }) => {
        // @ts-ignore
        const FaIcon = Icons[name];
        if (!FaIcon) return <p>Icon not found!</p>;

        return <FaIcon />;
    };

    return (
        <Button
            key={id}
            variant="outline"
            className="w-full justify-start h-auto py-3 px-4"
            asChild
        >
            <a href={url} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-start">
                        <span className="font-medium">{displayname}</span>
                        {description && (
                            <span
                                className="text-sm text-muted-foreground">{description}</span>
                        )}
                        <CustomFaIcon name={iconName} />
                    </div>
                </div>
            </a>
        </Button>
    );
}

export default LinkItem;