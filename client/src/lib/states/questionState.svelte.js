import { browser } from "$app/environment";

const QUESTIONS_KEY = "questions";
let initialQuestions = [];
if (browser && localStorage.hasOwnProperty(QUESTIONS_KEY)) {
  initialQuestions = JSON.parse(localStorage.getItem(QUESTIONS_KEY));
}

let questionState = $state(initialQuestions);

const saveQuestions = () => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questionState));
};

const useQuestionState = () => {
  return {
    get questions() {
      return questionState;
    },
    add: (question) => {
      questionState.push(question);
      saveQuestions();
    },
    changeDone: (id) => {
      const question = questionState.find((question) => question.id === id);
      question.done = !question.done;
      saveQuestions();
    },
    remove: (id) => {
      questionState = questionState.filter((question) => question.id !== id);
      saveQuestions();
    },
  };
};

export { useQuestionState };