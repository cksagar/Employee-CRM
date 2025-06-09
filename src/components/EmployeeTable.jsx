import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columns } from "./columns";
import TableHeader from "./TableHeader";
import AddEmployeeForm from "./AddEmployeeForm";
import EditEmployeeForm from "./EditEmployeeForm";
import { employees as initialEmployees } from "../models/employees";

import PaginationControls from "./Pagination";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [sorting, setSorting] = useState([{ id: "name", desc: false }]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const statusMatch =
        statusFilter === "All" ||
        emp.status.toLowerCase() === statusFilter.toLowerCase();

      const searchMatch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.department &&
          emp.department.toLowerCase().includes(searchQuery.toLowerCase()));

      return statusMatch && searchMatch;
    });
  }, [employees, statusFilter, searchQuery]);

  const table = useReactTable({
    data: filteredEmployees,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      onEdit: (employee) => setEditEmployee(employee),
      onDelete: (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
          setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        }
      },
    },
  });

  const sortedRows = table.getSortedRowModel().rows;
  const pageCount = Math.ceil(sortedRows.length / pageSize);

  const paginatedRows = useMemo(() => {
    const start = pageIndex * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, pageIndex]);

  useMemo(() => {
    setPageIndex(0);
  }, [statusFilter, searchQuery, sorting]);

  function handleAddEmployee(newEmployee) {
    setEmployees((prev) => [newEmployee, ...prev]);
    setPageIndex(0);
  }

  function handleUpdateEmployee(updatedEmployee) {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded overflow-x-auto">
        <div className="flex justify-between items-center p-4">
          <TableHeader
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <button
            onClick={() => setShowAddForm(true)}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Employee
          </button>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: "⬆️",
                        desc: "⬇️",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <PaginationControls
          pageCount={pageCount}
          currentPage={pageIndex}
          onPageChange={setPageIndex}
        />
      </div>

      {showAddForm && (
        <AddEmployeeForm
          onAdd={handleAddEmployee}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {editEmployee && (
        <EditEmployeeForm
          employee={editEmployee}
          onUpdate={handleUpdateEmployee}
          onClose={() => setEditEmployee(null)}
        />
      )}
    </div>
  );
}
