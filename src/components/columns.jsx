// columns.jsx
import { format } from "date-fns";

export const columns = [
  {
    accessorKey: "name",
    header: "Full Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const value = info.getValue();
      return (
        <span
          className={`px-2 py-1 rounded text-white ${
            value.toLowerCase() === "active" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: (info) => info.getValue() || "-",
  },
  {
    accessorKey: "updated",
    header: "Last Updated",
    cell: (info) => format(new Date(info.getValue()), "dd/MM/yyyy"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const employee = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => table.options.meta?.onEdit(employee)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => table.options.meta?.onDelete(employee.id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      );
    },
  },
];
