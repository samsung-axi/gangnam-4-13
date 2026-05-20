import Swal from "sweetalert2";

interface ConfirmParams {
  title: string;
  html?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const useConfirm = () => {
  const showConfirm = async ({
    title,
    html,
    confirmButtonText = '확인',
    cancelButtonText = '취소',
  }: ConfirmParams) => {
    const result = await Swal.fire({
      title,
      html,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true,
    });

    return result.isConfirmed;
  };

  return { showConfirm };
};