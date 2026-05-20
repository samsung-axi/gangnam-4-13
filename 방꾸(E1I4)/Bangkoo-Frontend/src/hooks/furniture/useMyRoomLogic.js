import { useDispatch } from 'react-redux';
import { removeFurniture } from '@/features/furniture/furnitureSlice';
import { removeInterior, removeAllInterior } from '@/features/furniture/interiorSlice';

export function useMyRoomLogic(furnitureDialog, interiorDialog) {
    const dispatch = useDispatch();

    const handleConfirmDelete = () => {
        dispatch(removeFurniture(furnitureDialog.selectedItem.id));
        furnitureDialog.closeDialog();
    };

    const handleConfirmInteriorDelete = () => {
        if (interiorDialog.deleteAll) {
            dispatch(removeAllInterior());
        } else if (interiorDialog.selectedItem) {
            dispatch(removeInterior(interiorDialog.selectedItem.id));
        }
        interiorDialog.close();
    };

    return { handleConfirmDelete, handleConfirmInteriorDelete };
}