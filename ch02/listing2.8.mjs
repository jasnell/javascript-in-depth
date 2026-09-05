// Listing 2.8: anti-pattern - recursive nested-menu build with += concatenation
function generateNestedMenu(items, depth = 0) {
  let result = '';
  const indent = ' '.repeat(depth);
  for (const item of items) {
    result += `${indent}<li>${item.title}`;
    if (item.children) {
      result += `\n${indent}<ul>\n${generateNestedMenu(item.children, depth + 1)}${indent}</ul>`;
    }
    result += '</li>\n';
  }
  return result;
}

const menu = {
  title: 'Root',
  children: Array(50).fill().map((_, i) => ({
    title: `Cat${i}`,
    children: Array(30).fill().map((_, j) => ({ title: `Sub${i}-${j}` })),
  })),
};

console.log('length:', generateNestedMenu(menu.children).length);
