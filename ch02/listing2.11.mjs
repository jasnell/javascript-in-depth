// Listing 2.11: fixed nested menu - push fragments into an array and join() once
function generateNestedMenu(items, depth = 0) {
  const fragments = [];
  const indent = ' '.repeat(depth);
  for (const item of items) {
    fragments.push(`${indent}<li>${item.title}`);
    if (item.children) {
      fragments.push(`\n${indent}<ul>\n`);
      // Recursively build child menu, accumulating fragments
      fragments.push(generateNestedMenu(item.children, depth + 1));
      fragments.push(`${indent}</ul>`);
    }
    fragments.push('</li>\n');
  }
  return fragments.join('');
}

const menu = {
  title: 'Root',
  children: Array(50).fill().map((_, i) => ({
    title: `Cat${i}`,
    children: Array(30).fill().map((_, j) => ({ title: `Sub${i}-${j}` })),
  })),
};

console.log('length:', generateNestedMenu(menu.children).length);
