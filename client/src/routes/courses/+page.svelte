<script>
	import { PUBLIC_API_URL } from "$env/static/public";
	
	let courses = $state({});
	let newCourse = $state();

	const fetchCourses = async () => {
		const response = await fetch(`${PUBLIC_API_URL}/api/courses`);
		courses = await response.json();
	};

	const addCourse = async () => {
		const response = await fetch(`${PUBLIC_API_URL}/api/courses`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: newCourse }),
		});

		newCourse = "";
		await fetchCourses();
	};

	$effect(() => {
		fetchCourses();
	});
</script>

<h1 class="text-center text-xl">Courses</h1> 

<ul class="flex flex-col gap-2 border p-2 mb-2">
	{#each courses as course}
		<li> 
			<a class="hover:underline" href={`/courses/${course.id}/`}>
				{course.name}
			</a>
		</li>
	{/each}
</ul>

<form class="space-x-2" onsubmit={addCourse}>
	<input
		type="text"
		name="name"
		bind:value={newCourse}
		placeholder="Add a new course"
		required
	/>
	<button class="border p-2 bg-yellow-100 hover:scale-110" type="submit">
		Add Course
	</button>
</form>