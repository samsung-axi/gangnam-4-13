import { useState, useCallback } from "react";

export default function useSearchDialog() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogTitle, setDialogTitle] = useState("알림");

    const openDialog = useCallback((message, title = "알림") => {
        setDialogMessage(message);
        setDialogTitle(title);
        setDialogOpen(true);
    }, []);

    const closeDialog = useCallback(() => {
        setDialogOpen(false);
    }, []);

    return {
        dialogOpen,
        dialogMessage,
        dialogTitle,
        openDialog,
        closeDialog,
    };
}
