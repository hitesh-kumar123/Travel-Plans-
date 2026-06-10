const fs = require("fs");
const https = require("https");

// Read the package.json to get some info if needed, but here we just need the repo path from the user.
const REPO_OWNER = "hitesh-kumar123";
const REPO_NAME = "Travel-Plans-";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("\n❌ Error: GITHUB_TOKEN environment variable is not set.");
  console.error(
    "Please run: set GITHUB_TOKEN=your_personal_access_token && node scripts/setup-github.js",
  );
  process.exit(1);
}

const API_BASE_URL = "api.github.com";
const HEADERS = {
  "User-Agent": "Node.js Script",
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
};

// Required Labels (Fixed: Added the missing 'refactor' label configuration)
const labels = [
  {
    name: "good first issue",
    color: "7057ff",
    description: "Good for newcomers",
  },
  {
    name: "help wanted",
    color: "008672",
    description: "Extra attention is needed",
  },
  { name: "bug", color: "d73a4a", description: "Something isn't working" },
  { name: "feature", color: "a2eeef", description: "New feature or request" },
  {
    name: "documentation",
    color: "0075ca",
    description: "Improvements or additions to documentation",
  },
  {
    name: "enhancement",
    color: "a2eeef",
    description: "New feature or request",
  },
  { name: "frontend", color: "c2e0c6", description: "Frontend related issue" },
  { name: "backend", color: "bfd4f2", description: "Backend related issue" },
  { 
    name: "refactor", 
    color: "ebd775", 
    description: "Code cleanups, structure improvements, or optimizations" 
  },
  { name: "urgent", color: "b60205", description: "Urgent priority" },
];

// 5 Beginner Friendly Issues
const issues = [
  {
    title: "Improve loading states in authentication pages",
    body: "Currently, when a user logs in or registers, the button might not show a loading spinner. It would be a great UX improvement to show a spinner and disable the button while the request is processing.\n\n**Expected Outcome:**\n- Add a `loading` state to Login and Register components.\n- Disable the submit button when `loading` is true.\n- Show a small circular progress spinner on the button.",
    labels: ["good first issue", "frontend", "enhancement"],
  },
  {
    title: "Add empty-state UI for dashboard lists",
    body: 'When a user has no trips or no expenses, the dashboard just shows an empty area or table. We should display a nice "Empty State" message with an illustration or icon encouraging them to create their first item.\n\n**Expected Outcome:**\n- Check `TripsView` and `ExpensesView`.\n- If the array is empty, render a friendly message (e.g., "No trips yet! Click Add Trip to start planning.").\n- Use an appropriate Material-UI icon.',
    labels: ["good first issue", "frontend", "enhancement"],
  },
  {
    title: "Improve API error messages for failed requests",
    body: 'Currently, if an API request fails, we show a generic toast message or just log to the console. We should ensure the backend sends a clear error message (e.g., `res.status(400).json({ message: "Invalid email format" })`) and the frontend displays this exact message using `react-toastify`.\n\n**Expected Outcome:**\n- Review `api.js` interceptors.\n- Ensure toast notification extracts `error.response.data.message` if available.',
    labels: ["good first issue", "backend", "frontend"],
  },
  {
    title: "Add reusable form validation messages",
    body: 'Some forms might not show clear validation messages under the inputs (e.g., "Password must be at least 6 characters"). We should implement consistent helper texts for form inputs using Material-UI\'s `helperText` prop combined with the `error` prop.\n\n**Expected Outcome:**\n- Update the main forms (Login, Register, Add Trip) to show inline validation errors.',
    labels: ["good first issue", "frontend"],
  },
  {
    title: "Refactor repeated button styles into reusable component",
    body: 'There might be repeated styling for Primary buttons across different pages. We should create a central `<PrimaryButton>` wrapper component or ensure all buttons use the global MUI theme properly without inline style overrides.\n\n**Expected Outcome:**\n- Identify inline-styled buttons.\n- Replace them with a standard MUI `<Button variant="contained" color="primary">` or a custom wrapper component.',
    labels: ["good first issue", "frontend", "refactor"],
  },
];

function makeRequest(path, method, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_BASE_URL,
      path: path,
      method: method,
      headers: HEADERS,
    };

    const req = https.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseBody || "{}"));
        } else {
          if (res.statusCode === 422 && method === "POST") {
            resolve({ alreadyExists: true });
          } else {
            // Include status code in the thrown error object for fine-grained handling
            const err = new Error(responseBody);
            err.statusCode = res.statusCode;
            reject(err);
          }
        }
      });
    });

    req.on("error", (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createLabels() {
  console.log("--- Creating Labels ---");
  for (const label of labels) {
    try {
      const res = await makeRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/labels`,
        "POST",
        label,
      );
      if (res.alreadyExists) {
        console.log(`[SKIPPED] Label "${label.name}" already exists.`);
      } else {
        console.log(`[SUCCESS] Created label "${label.name}".`);
      }
    } catch (error) {
      console.error(`\n[CRITICAL ERROR] Failed to create label "${label.name}":`, error.message);
      if (error.statusCode === 401 || error.statusCode === 404) {
        console.error("❌ Authentication or Repo Path failed. Stopping execution to prevent repetitive failures.");
        process.exit(1);
      }
    }
  }
}

async function createIssues() {
  console.log("\n--- Creating Issues ---");
  for (const issue of issues) {
    try {
      const res = await makeRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
        "POST",
        issue,
      );
      console.log(
        `[SUCCESS] Created issue: "${issue.title}" (Issue #${res.number})`,
      );
    } catch (error) {
      console.error(`\n[CRITICAL ERROR] Failed to create issue "${issue.title}":`, error.message);
      if (error.statusCode === 401 || error.statusCode === 404) {
        console.error("❌ Request unauthorized or repository not found. Stopping execution.");
        process.exit(1);
      }
    }
  }
}

async function run() {
  console.log("🚀 Starting GitHub Repository Setup Automation...\n");
  await createLabels();
  await createIssues();
  console.log("\n✅ Setup automation completed!");
}

run();
