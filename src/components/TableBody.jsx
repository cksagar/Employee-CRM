import { flexRender } from "@tanstack/react-table";

export default function TableBody({ table }) {
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id} className="border-t">
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-2">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
