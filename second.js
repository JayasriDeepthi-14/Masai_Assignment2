// L0 - Filter and Sort Data with Higher-Order Functions

function processStudents(students) {
  // Step 1: Filter students who scored above 60 marks
  const filtered = students.filter(student => student.marks > 60);

  // Step 2: Sort the filtered students in descending order of marks
  const sorted = filtered.sort((a, b) => b.marks - a.marks);

  // Step 3: Map the sorted array to extract only names
  const names = sorted.map(student => student.name);

  // Step 4: Return the array of sorted names
  return names;
}

const s = [
  { name: "Alice", marks: 58 },
  { name: "Bob", marks: 85 },
  { name: "Charlie", marks: 92 },
  { name: "David", marks: 45 },
  { name: "Emma", marks: 76 },
  { name: "Frank", marks: 63 },
  { name: "Grace", marks: 89 },
  { name: "Hannah", marks: 95 },
  { name: "Ian", marks: 54 },
  { name: "Jack", marks: 79 },
  { name: "Kate", marks: 67 },
  { name: "Leo", marks: 88 },
  { name: "Mia", marks: 91 },
  { name: "Nathan", marks: 72 },
  { name: "Olivia", marks: 82 }
];

console.log(processStudents(s));