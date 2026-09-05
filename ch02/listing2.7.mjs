// Listing 2.7: anti-pattern intensified - nested loops concatenating each field with +=
function generateUserTable(users, fields) {
  let html = '<table>';
  for (const user of users) {
    html += '<tr>';
    // Inner loop: concatenates each field for every user
    for (const field of fields) {
      html += `<td>${user[field]}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  return html;
}

const users = Array(25000).fill().map((_, i) => ({
  id: i,
  name: `User${i}`,
  email: `user${i}@test.com`,
  department: `Dept${i % 10}`,
  role: `Role${i % 5}`,
  joinDate: new Date().toISOString(),
  salary: 50000 + (i * 100),
  manager: `Manager${Math.floor(i / 10)}`,
  location: `Office${i % 3}`,
  phoneNumber: `555-${String(i).padStart(4, '0')}`,
}));

const fields = [
  'id', 'name', 'email', 'department', 'role',
  'joinDate', 'salary', 'manager', 'location', 'phoneNumber',
];

console.log('length:', generateUserTable(users, fields).length);
