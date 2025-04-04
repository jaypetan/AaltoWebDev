<script>
	import { PUBLIC_API_URL } from "$env/static/public";
	
	let course = $state({});
	let questions = $state({});
	let { data } = $props();

	let newQuestion = $state({ title: "", text: "" });


	const fetchCourse = async () => {
		const response = await fetch(`${PUBLIC_API_URL}/api/courses/${data.id}`);
		course = await response.json();
	};

	const fetchQuestions = async () => {
		const response = await fetch(`${PUBLIC_API_URL}/api/courses/${data.id}/questions`);
		questions = await response.json();
	};

	const upvoteQuestion = async (qId) => {
		const response = await fetch(`${PUBLIC_API_URL}/api/courses/${data.id}/questions/${qId}/upvote`, {
			method: "POST",
		});
		await fetchQuestions();
	};

	const deleteQuestion = async (qId) => {
		const response = await fetch(`${PUBLIC_API_URL}/api/courses/${data.id}/questions/${qId}`, {
			method: "DELETE",
		});
		await fetchQuestions();
	};

	const addQuestion = async (event) => {
		event.preventDefault();
		
		const response = await fetch(`${PUBLIC_API_URL}/api/courses/${data.id}/questions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newQuestion),
		});

		newQuestion = { title: "", text: "" };
		await fetchQuestions();
	};

	$effect(() => {
		fetchCourse();
		fetchQuestions();
	});

</script>

<h1>Course Name: {course.name}</h1> 

<ul class="flex flex-col gap-2 border p-2 mb-2">
	{#each questions as question}
		<li> 
			<div>
				<p>Title: {question.title}</p>
				<p>Upvotes: {question.upvotes}</p>
				<button onclick={() => upvoteQuestion(question.id)}>upvote</button>
				<button onclick={() => deleteQuestion(question.id)}>delete</button>
			</div>
		</li>
	{/each}
</ul>

<form class="flex flex-col gap-2" onsubmit={addQuestion}>
	<input
		type="text"
		name="title"
		bind:value={newQuestion.title}
		placeholder="title"
		required
		class=""
	/>
	<textarea
		name="text"
		bind:value={newQuestion.text}
		placeholder="text"
		required
	></textarea>

	<button class="border p-2 bg-yellow-100 hover:scale-110" type="submit">Add New Question</button>
</form>
