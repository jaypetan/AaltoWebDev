import * as coursesRepository from "./coursesRepository.js";

const getCourses = async (c) => {
  return c.json(await coursesRepository.readAll());
};

const getCourse = async (c) => {
  const id = c.req.param("id");
  return c.json(await coursesRepository.readOne(id));
};

const createCourse = async (c) => {
  const course = await c.req.valid("json");
  return c.json(await coursesRepository.create(course));
};

const deleteCourse = async (c) => {
  const id = c.req.param("id");
  return c.json(await coursesRepository.remove(id));
};

export { createCourse, deleteCourse, getCourse, getCourses };
