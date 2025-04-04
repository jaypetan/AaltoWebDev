import postgres from "postgres";

const sql = postgres();

const readAll = async (id) => {
  return await sql`SELECT * FROM questions 
    WHERE course_id = ${id}`;
};

const create = async (id, question) => {
    const result = await sql`INSERT INTO questions (title, text, course_id, upvotes)
      VALUES (${question.title}, ${question.text}, ${id}, 0)
      RETURNING *`;
    return result[0];
};
  
const upvote = async (id, qId) => {
    const upvote = await sql`SELECT * FROM questions 
      WHERE id = ${qId} AND course_id = ${id}`;
    upvote[0].upvotes++;
    const result = await sql`UPDATE questions
      SET upvotes = ${upvote[0].upvotes}
      WHERE id = ${qId}
      RETURNING *`;
    return result[0];
};
// const update = async (id, book) => {
//   const result = await sql`UPDATE books
//     SET title = ${book.title}, year = ${book.year}
//     WHERE id = ${id}
//     RETURNING *`;
//   return result[0];
// };

const remove = async (id, qId) => {
  const result = await sql`DELETE FROM questions 
    WHERE id = ${qId} AND course_id = ${id} 
    RETURNING *`;
  return result[0];
};

export { create, readAll, upvote, remove };
