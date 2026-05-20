import Swal from "sweetalert2";

export const useToast = () => {
  const showToast = (message: string, type: "success" | "error" | "info") => {
    Swal.fire({
      icon: type,
      title: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  return { showToast };
};
