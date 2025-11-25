// L1 - Grouping and Summing with reduce()

function countCategories(categories) {
  return categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
}
const input = ["electronics", "clothing", "electronics", "toys", "clothing", "toys", "toys"];
const result = countCategories(input);
console.log(result);

// Extra Challenge: Sort by counts in descending order

function getSortedCategories(categories) {
  const countObj = countCategories(categories);
  const sorted = Object.entries(countObj)
    .sort((a, b) => b[1] - a[1])     
    .map(entry => entry[0]);         
  return sorted;
}
const input2 = ["electronics", "clothing", "electronics", "toys", "clothing", "toys", "toys"];
const sortedCategories = getSortedCategories(input2);
console.log(sortedCategories);