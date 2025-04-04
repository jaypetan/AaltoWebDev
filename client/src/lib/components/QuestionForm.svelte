<script>
  import { useQuestionState } from "$lib/states/questionState.svelte.js";
  let questionState = useQuestionState();

  const addQuestion = (e) => {
    const question = Object.fromEntries(new FormData(e.target));
    question.id = crypto.randomUUID();
    questionState.add(question);
    e.target.reset();
    e.preventDefault();
  };
</script>

<form class="space-y-4" onsubmit={addQuestion}>
  <label class="label" for="name">
    <span class="label-text">Question</span>
    <input
      class="input"
      id="name"
      name="name"
      type="text"
      placeholder="Enter a new question"
    />
  </label>
  <label class="flex items-center space-x-2" for="done">
    <input id="done" name="done" type="checkbox" />
    <p>Done</p>
  </label>
  <input class="w-full btn preset-filled-primary-500" type="submit" value="Add Question" />
</form>