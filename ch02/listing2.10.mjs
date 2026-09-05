// Listing 2.10: fixed user table - accumulate fragments in arrays and join() (linear, ConsString-friendly)
function generateUserTable(users, fields) {
  const rows = [];
  rows.push('<table>');
  for (const user of users) {
    const cells = [];
    for (let j = 0; j < fields.length; j++) {
      cells.push(`<td>${user[fields[j]]}</td>`);
    }
    rows.push('<tr>' + cells.join('') + '</tr>');
  }
  rows.push('</table>');
  return rows.join('');
}

const users = Array(25000).fill().map((_, i) => ({
  id: i,
  name: `User${i}`,
  email: `user${i}@test.com`,
}));

const fields = ['id', 'name', 'email'];
console.log('length:', generateUserTable(users, fields).length);
