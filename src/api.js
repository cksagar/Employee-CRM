const BASE_URL = "http://localhost:3000/api/v1/employees"; // Update as needed

export async function fetchEmployees() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function addEmployee(employee) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  return res.json();
}

export async function updateEmployee(id, employee) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  return res.json();
}

export async function deleteEmployee(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res.ok;
}
