import { useState } from "react";

// 다이얼로그 관련 훅
export function useFurnitureDialog() {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openDialog = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const closeDialog = () => {
        setSelectedItem(null);
        setOpen(false);
    };

    return { open, selectedItem, openDialog, closeDialog };
}

export function useInteriorDialog() {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteAll, setDeleteAll] = useState(false);

    const openDelete = (item) => {
        setSelectedItem(item);
        setDeleteAll(false);
        setOpen(true);
    };

    const openDeleteAll = () => {
        setDeleteAll(true);
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setSelectedItem(null);
        setDeleteAll(false);
    };

    return { open, selectedItem, deleteAll, openDelete, openDeleteAll, close };
}

export function useInteriorSaveDialog() {
    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return { open, openDialog, closeDialog };
}

export function useSettingDialog() {
    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return { open, openDialog, closeDialog };
}

export function useAIDialog() {
    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return { open, openDialog, closeDialog };
}