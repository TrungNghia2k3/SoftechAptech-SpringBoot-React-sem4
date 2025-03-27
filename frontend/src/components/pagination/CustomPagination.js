import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const [pageRange, setPageRange] = useState({ start: 1, end: 10 });

  useEffect(() => {
    if (totalPages <= 10) {
      setPageRange({ start: 1, end: totalPages });
    } else {
      if (currentPage > pageRange.end) {
        setPageRange({ start: currentPage - 5, end: currentPage + 4 });
      } else if (currentPage < pageRange.start) {
        setPageRange({ start: currentPage - 4, end: currentPage + 5 });
      }
    }

    // Ensure start and end are within valid page range
    setPageRange((prevState) => ({
      start: Math.max(1, prevState.start),
      end: Math.min(totalPages, prevState.end),
    }));
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <Pagination className="justify-content-center mt-3">
      <Pagination.First
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
      <Pagination.Prev
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {Array.from(
        { length: Math.min(totalPages, pageRange.end - pageRange.start + 1) },
        (_, index) => {
          const pageNumber = pageRange.start + index;
          return (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === currentPage}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </Pagination.Item>
          );
        }
      )}
      <Pagination.Next
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

export default CustomPagination;
