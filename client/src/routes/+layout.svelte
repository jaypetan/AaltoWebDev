<script>
    import "../app.css";
    import { useUserState } from "$lib/states/userState.svelte.js";

    import Header from "$lib/components/layout/Header.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";

    let { children, data } = $props();

    const userState = useUserState();
    if (data.user) {
        userState.user = data.user;
    }

    $effect(() => {
        document.body.classList.add("e2e-ready");
    });
</script>

{#if data.user?.email}
  <p>{data.user?.email}</p>
{/if}

<div class="flex flex-col h-full">
    <main class="container mx-auto max-w-2xl grow">
        {@render children()}
    </main>
</div>
