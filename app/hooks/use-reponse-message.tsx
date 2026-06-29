import { useEffect } from "react";
import { toast } from "sonner";

export function useResponseMessage(
  resData: { success: boolean; message: string } | undefined,
) {
  useEffect(() => {
    if (resData) {
      if (resData.success) {
        toast.success(resData.message);
      } else {
        toast.error(resData.message);
      }
    }
  }, [resData]);
}
