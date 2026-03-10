import fs from "fs";

const API_KEY = process.env.GOOGLE_API_KEY?.trim();

if (!API_KEY) {
  console.error(" GOOGLE_API_KEY not set");
  process.exit(1);
}

const endpoint =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

//   const prompt = `
// Write a Playwright test in JavaScript using @playwright/test.

// Steps:
// 1. Open https://example.com
// 2. Verify page title contains "Example Domain"

// Return only the code.
// `;


const prompt= `Write multiple automated tests in **JavaScript** using **@playwright/test** for https://eddemo.edvantalabs.com/login/index.php. 
Include these test scenarios:

1. Navigate to the given URL.
2. Log in using:
   - Username: shabrej.ahmad
   - Password: Edvanta#21$
3. Verify that the login is successful (for example by checking dashboard by  URL change).
4.  In my learning Locate the search box, type **"connect +"**, and press **Enter**.
5. Verify that **"Connect +"** appears in the search results.
6. Verify that the **Connect + course card** is visible.
7. Click the **Connect +** course card and verify navigation to the correct page:  
   https://eddemo.edvantalabs.com/course/view.php?id=2
8. Collect all links on the course page and verify that they are clickable.

**Important:**
- Do NOT return any HTML from the website.
- Return only JavaScript code, ready to save in a Playwright test file.

Return the code only.


`


// const prompt = `
// Write multiple automated tests in **JavaScript** using **@playwright/test** for https://example.com. 
// Include these test scenarios:

// 1. Verify the page title contains "Example Domain".
// 2. Check that the main heading <h1> is visible.
// 3. Verify that the link "More information..." navigates to iana.org.
// 4. Take a screenshot of the homepage.
// 5. Add a simple example of filling a form (use a placeholder form URL).

// **Important:**
// - Do NOT return any HTML from the website.
// - Return only JavaScript code, ready to save in a Playwright test file.

// Return the code only.
// `;

async function generateTest() {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  const data = await res.json();

  console.log("API Response:", data); 

  if (!data.candidates) {
    console.error(" Gemini API error:", data);
    return;
  }

  const code = data.candidates[0].content.parts[0].text;

  fs.writeFileSync("Tests/Test02.spec.js", code);

  console.log(" Test created: Test02.spec.js");
}

generateTest();