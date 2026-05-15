// ---------------- HTML STARTER ----------------
export const htmlStarter = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>

  <!-- Link CSS -->
  <link rel="stylesheet" href="root/src/style.css" />
</head>
<body>

  <h1>Hello World</h1>

  <!-- Script -->
  <script src="root/src/script.js"></script>
</body>
</html>
`;


// ---------------- CSS STARTER ----------------
export const cssStarter = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  color: #333;
}
`;


// ---------------- JAVASCRIPT STARTER ----------------
export const jsStarter = `// Entry point
console.log("Hello World");

// Example function
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));
`;


// ---------------- C++ STARTER ----------------
export const cppStarter = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;

    // Example loop
    for (int i = 0; i < 5; i++) {
        cout << i << " ";
    }

    return 0;
}
`;