// Listing 2.6: anti-pattern - building an HTML table by += concatenation in a loop
function generateUserTable(users) {
  let html = '<table>';
  for (const user of users) {
    html += `<tr><td>${user.id}</td><td>${user.name}</td><td>${user.email}</td></tr>`;
  }
  html += '</table>';
  return html;
}

const users = Array(25000).fill().map((_, i) => ({
  id: i,
  name: `User${i}`,
  email: `user${i}@test.com`,
}));

const html = generateUserTable(users);
console.log('length:', html.length);
