import { toast } from "react-toastify";
import { getErrorMessage } from "./error";

export const toastError = (error, fallback) => {
  const message = getErrorMessage(error, fallback);
  toast.error(message);
  return message;
};
