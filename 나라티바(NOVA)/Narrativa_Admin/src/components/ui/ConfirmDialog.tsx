interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
  }
  
  const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-title font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 font-contents mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border font-contents border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 font-contents text-white rounded-lg hover:bg-red-600"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmDialog;