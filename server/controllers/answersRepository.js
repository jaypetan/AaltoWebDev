import postgres from "postgres";

const sql = postgres();

const readQn = async (qid) => {
    const result = await sql`SELECT * FROM questions WHERE id = ${qid}`;
    return result[0];
};

const read = async (qid) => {
    return await sql`SELECT id, upvotes, text, question_id FROM question_answers WHERE question_id = ${qid}`;
};

const create = async (qid, answer, email) => {
    const user = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (user.length === 0) throw new Error("User not found");

    const result = await sql`INSERT INTO question_answers (question_id, user_id, upvotes, text)
            VALUES (${qid}, ${user[0].id}, 0, ${answer.text})
            RETURNING *`;
    return result[0];
};

const upvote = async (aid) => {
    const result = await sql`
        UPDATE question_answers
        SET upvotes = upvotes + 1
        WHERE id = ${aid}
        RETURNING *`;
    return result[0];
};

export { readQn, read, create, upvote };
