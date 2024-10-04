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
    <div className="flex justify-center mt-4 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-2 px-1.5 bg-blue-500 text-white rounded disabled:opacity-50 text-xs transition-transform duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-600"
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`mx-0.5 px-1.5 rounded transition-transform duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-400 ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-xs"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-2 px-1.5 bg-blue-500 text-white rounded disabled:opacity-50 text-xs transition-transform duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-600"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
