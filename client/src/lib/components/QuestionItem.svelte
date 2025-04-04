<script>
  import { useQuestionState } from "$lib/states/questionState.svelte.js";
  let questionState = useQuestionState();

  let { question } = $props();
</script>

<div class="flex items-center space-x-4 card border-[2px] p-4 border-gray-300">
  <span class="text-xl">{question.done ? "✅" : "❌"}</span>
  <span class="grow">{question.name}</span>
  <button class="text-2xl" onclick={() => questionState.remove(question.id)}>🗑</button>
</div>