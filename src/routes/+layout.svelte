<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { setupI18n, RTL_LOCALES } from '$lib/i18n';
  import { locale, isLoading } from 'svelte-i18n';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();

  setupI18n();

  const dir = $derived(RTL_LOCALES.has($locale ?? '') ? 'rtl' : 'ltr');

  // Hyperspace template sets is-preload on <body> to start elements at opacity:0,
  // then expects main.js to remove it. We do it here instead.
  onMount(() => document.body.classList.remove('is-preload'));
</script>

<svelte:head>
  <title>United-Earth2026</title>
  <meta name="description" content="We have to connect with each other to show how powerful our movement is." />
</svelte:head>

<div {dir}>
  {#if !$isLoading}
    {@render children()}
    <Footer />
  {/if}
</div>
