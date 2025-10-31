"use client"

import { useCurrentTheme } from "@/hooks/use-current-theme";
import { UserButton } from "@clerk/nextjs";
import {dark} from "@clerk/themes";

interface Props {
    showName?: boolean;
}

export const UserControl = ({ showName }: Props) => {
    const currentTheme = useCurrentTheme();
    return(
        <UserButton
        showName={showName}
        appearance={{
            elements: {
                userButtonBox: "rounded-md! border-3 border-transparent hover:border-gray-300 dark:hover:border-gray-500 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-all",
                userButtonAvatarBox: "rounded-md! size-8!",
                userButtonTrigger: "rounded-md! ",
            },
            baseTheme: currentTheme === "dark" ? dark : undefined,
        }}
        />
    );
}