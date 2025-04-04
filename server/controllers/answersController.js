import * as answersRepository from "./answersRepository.js";

const getQuestion = async (c) => {
    const qid = c.req.param("qId");
    return c.json(await answersRepository.readQn(qid));
};

const getAnswers = async (c) => {
    const qid = c.req.param("qId");
    return c.json(await answersRepository.read(qid));
};

const createAnswer = async (c) => {  
    const qid = c.req.param("qId");
    const email = c.user.email;
    const answer = await c.req.json();
    
    if (!answer.text || answer.text.trim() === "") {
        return c.json({ message: "Answer text is required" }, 400);
    }

    return c.json(await answersRepository.create(qid, answer, email));
};

const upvoteAnswer = async (c) => {
    const aid = c.req.param("aId");
    return c.json(await answersRepository.upvote(aid));
};

export { getQuestion, getAnswers, createAnswer, upvoteAnswer };
