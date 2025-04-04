<script>
  import QuestionItem from "./QuestionItem.svelte";
  import { fade } from "svelte/transition";

  import { useQuestionState } from "$lib/states/questionState.svelte.js";
  let questionState = useQuestionState();
</script>

<ul class="space-y-4">
  {#each questionState.questions as question}
    <li transition:fade>
      <QuestionItem {question} />
    </li>
  {/each}
</ul>