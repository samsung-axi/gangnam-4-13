import { useEffect } from "react";

export function useGlobalInertEffect(dialogs = []) {
    useEffect(() => {
        const root = document.getElementById("root");
        if (!root) return;

        const dialogOpened = dialogs.some((d) => d === true);

        if (dialogOpened) {
            root.setAttribute("inert", "true");
        } else {
            root.removeAttribute("inert");
        }

        return () => {
            root.removeAttribute("inert");
        };
    }, [dialogs]);
}
