<script>
	import { PUBLIC_API_URL } from "$env/static/public";
	
	let question = $state({});
	let answers = $state([]);
	let { data } = $props();

	let newAnswer = $state({ text: "" });


	const fetchQuestion = async () => {
		const response = await fetch(`${PUBLIC_API_URL}/api/courses/${data.id}/questions/${data.qid}`);
		question = await response.json();
	};

	const fetchAnswers = async () => {
		const response = await fetch(`${PUBLIC_API_URL}/api/courses/${data.id}/questions/${data.qid}/answers`);
		answers = await response.json();
	};

	const upvoteAnswer = async (aId) => {
		const response = await fetch(`${PUBLIC_API_URL}/api/courses/${data.id}/questions/${data.qid}/answers/${aId}/upvote`, {
			method: "POST",
			credentials: "include",
		});
		await fetchAnswers();
	};

	const addAnswer = async (event) => {
		event.preventDefault();
		
		const response = await fetch(`${PUBLIC_API_URL}/api/courses/${data.id}/questions/${data.qid}/answers`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(newAnswer),
		});

		newAnswer = { text: "" };
		await fetchAnswers();
	};

	$effect(() => {
		fetchQuestion();
		fetchAnswers();
	});

</script>

<h1>{question.title}</h1> 

<p>{question.text}</p>

<ul class="flex flex-col gap-2 border p-2 mb-2">
	{#each answers as answer}
		<li> 
			<div>
				<p>{answer.text}</p>
				<p>{answer.upvotes}</p>
				{#if data.user}
					<button onclick={() => upvoteAnswer(answer.id)}>Upvote</button>
				{/if}
			</div>
		</li>
	{/each}
</ul>
{#if data.user?.email}
	<form class="flex flex-col gap-2" onsubmit={addAnswer}>
		<textarea
			name="text"
			bind:value={newAnswer.text}
			placeholder="text"
			required
		></textarea>

		<button class="border p-2 bg-yellow-100 hover:scale-110" type="submit">Add New Answer</button>
	</form>
{/if}

