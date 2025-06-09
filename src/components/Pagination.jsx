export default function PaginationControls({
  pageCount,
  currentPage,
  onPageChange,
}) {
  return (
    <div className="flex justify-end items-center px-4 py-2 border-t space-x-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        &lt; Previous
      </button>

      <span className="text-sm text-gray-700">
        Page {currentPage + 1} of {pageCount}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 >= pageCount}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next &gt;
      </button>
    </div>
  );
}
