import React from "react";

type VerificationStatusProps = {
  status: "verified" | "pending" | "rejected";
  size?: "sm" | "md";
};

export default function VerificationStatus({ status, size = "sm" }: VerificationStatusProps) {
  const getStatusStyles = () => {
    const baseClasses = `rounded-full flex items-center ${
      size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"
    } font-medium`;
    
    switch (status) {
      case "verified":
        return `${baseClasses} bg-green-500 text-white`;
      case "pending":
        return `${baseClasses} bg-orange-500 text-white`;
      case "rejected":
        return `${baseClasses} bg-red-500 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "verified":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case "pending":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case "rejected":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <span className={getStatusStyles()}>
      {getStatusIcon()}
      {getStatusLabel()}
    </span>
  );
}
