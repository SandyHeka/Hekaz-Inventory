import React from "react";
type ToastProps = {
  message: string;
  type?: "success" | "error" | "warning";
};
const ToastMessage = ({ message, type = "success" }: ToastProps) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded shadow-sm fixed top-14 right-14 z-50 animate-slide-in`}
    >
      {message}
    </div>
  );
};

export default ToastMessage;
