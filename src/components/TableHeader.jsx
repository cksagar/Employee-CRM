export default function TableHeader({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="flex flex-wrap justify-between items-center p-4 gap-4">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search by name, email, department"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-1 rounded w-64"
        />
        <select
          className="border px-3 py-1 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Passive">Passive</option>
        </select>
      </div>
    </div>
  );
}
