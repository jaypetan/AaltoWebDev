import * as questionsRepository from "./questionsRepository.js";

const getQuestions = async (c) => {
    const id  = c.req.param("id");
    return c.json(await questionsRepository.readAll(id));
};

const createQuestion = async (c) => {
    const id  = c.req.param("id");
    const question = await c.req.valid("json");
    return c.json(await questionsRepository.create(id, question));
};

const upvoteQuestion = async (c) => {
    const id  = c.req.param("id");
    const qId = c.req.param("qId");
    return c.json(await questionsRepository.upvote(id, qId));
  };

const deleteQuestion = async (c) => {
    const id  = c.req.param("id");
    const qId = c.req.param("qId");
  return c.json(await questionsRepository.remove(id, qId));
};

export { createQuestion, getQuestions, upvoteQuestion, deleteQuestion };
