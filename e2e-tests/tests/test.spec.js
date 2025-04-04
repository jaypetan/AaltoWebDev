import { expect, test } from "@playwright/test";

test("The page has a heading Courses.", async ({ page }) => {
  await page.goto("/");
  await page.locator(".e2e-ready").waitFor();
  await expect(page.getByRole("heading", { name: "Courses", exact: true }))
    .toBeVisible();
});

test("User email is displayed when logged in.", async ({ page }) => {
  await page.goto("/");
  await page.locator(".e2e-ready").waitFor();
  const email = await page.locator("p");
  await expect(email).toHaveText(/.*@.*\..*/); // checks if a valid email is displayed
});

test("Add a new course and see it listed.", async ({ page }) => {
  const newCourseName = "JavaScript Basics";

  await page.goto("/"); // replace with correct route if needed
  await page.locator("input[placeholder='Add a new course']").fill(newCourseName);
  await page.locator("button[type='submit']").click();

  const courseItem = await page.locator(`a:has-text("${newCourseName}")`);
  await expect(courseItem).toBeVisible();
});

test("Add a new question to a course and see it listed.", async ({ page }) => {
  const courseName = "JavaScript Basics";
  const questionTitle = "What is a closure?";
  const questionText = "Can you explain what a closure is in JavaScript?";

  await page.goto(`/courses/${courseName}`); // replace with the actual course URL

  // Fill out the form to add a question
  await page.locator('input[name="title"]').fill(questionTitle);
  await page.locator('textarea[name="text"]').fill(questionText);
  await page.locator('button[type="submit"]').click();

  // Ensure the question is displayed
  const questionItem = await page.locator(`text=${questionTitle}`);
  await expect(questionItem).toBeVisible();
});

test("User can upvote a question.", async ({ page }) => {
  const courseName = "JavaScript Basics";
  const questionTitle = "What is a closure?";

  await page.goto(`/courses/${courseName}`); // replace with the actual course URL

  // Locate the upvote button and click it
  const upvoteButton = await page.locator(`button:has-text("upvote")`);
  await upvoteButton.click();

  // Check if the upvote count has increased
  const upvoteCount = await page.locator(`text=Upvotes:`);
  await expect(upvoteCount).toContainText("1"); // Adjust based on actual count after upvoting
});

test("User can delete a question.", async ({ page }) => {
  const courseName = "JavaScript Basics";
  const questionTitle = "What is a closure?";

  await page.goto(`/courses/${courseName}`); // replace with the actual course URL

  // Locate the delete button and click it
  const deleteButton = await page.locator(`button:has-text("delete")`);
  await deleteButton.click();

  // Ensure the question is no longer in the list
  const questionItem = await page.locator(`text=${questionTitle}`);
  await expect(questionItem).not.toBeVisible();
});

test("The course name is displayed correctly.", async ({ page }) => {
  const courseName = "JavaScript Basics";

  await page.goto(`/courses/${courseName}`); // replace with the actual course URL
  const courseHeading = await page.locator("h1");
  await expect(courseHeading).toHaveText(`Course Name: ${courseName}`);
});