import { z } from "zod";

// Courses validation schema
const coursesValidator = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters long"),
});

// Questions validation schema
const questionsValidator = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  text: z.string().min(3, "Text must be at least 3 characters long"),
});

export { coursesValidator, questionsValidator };
