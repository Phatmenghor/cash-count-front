// src/components/Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`mx-2 px-3 text-gray-600 border-gray-800 rounded border transition-transform duration-200 ease-in-out transform hover:scale-105 disabled:opacity-40`}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          disabled={page === currentPage}
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`mx-0.5 text-xs border border-gray-400 px-2 rounded transition-transform duration-200 ease-in-out transform ${
            page !== currentPage && "hover:scale-105 hover:border-blue-600"
          } ${
            page === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "text-gray-800"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`ml-2 px-3 text-gray-600 border-gray-800 hover:border-blue-800 rounded border transition-transform duration-200 ease-in-out transform hover:scale-105 disabled:opacity-40`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
