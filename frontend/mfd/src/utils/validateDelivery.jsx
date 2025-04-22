import { toast } from "react-toastify";

export const validateDelivery = (deliveryInfo) => {
  if (
    !deliveryInfo.address.trim() ||
    !deliveryInfo.city.trim() ||
    !deliveryInfo.phoneNo.trim()
  ) {
    toast.error("Please fill in all fields", {
      position: "bottom-center",
      theme: "dark",
    });
    return false;
  }
  return true;
};
