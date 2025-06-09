import { useEffect, useState, useMemo } from "react";
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
import PaginationControls from "./Pagination";

import {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [sorting, setSorting] = useState([{ id: "name", desc: false }]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees().then(setEmployees).catch(console.error);
  }, []);

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
      onDelete: async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
          const success = await deleteEmployee(id);
          if (success) {
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
          }
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

  async function handleAddEmployee(newEmployee) {
    const saved = await addEmployee(newEmployee);
    setEmployees((prev) => [saved, ...prev]);
    setPageIndex(0);
  }

  async function handleUpdateEmployee(updatedEmployee) {
    const saved = await updateEmployee(updatedEmployee.id, updatedEmployee);
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === saved.id ? saved : emp))
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
