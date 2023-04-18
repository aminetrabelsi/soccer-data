<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';

  let msg = '';
  $: msg;

  onMount(async () => {
    const leagues = await axios.get('/backend/');
    console.log(leagues.data);
    msg = leagues.data.message;
  })

</script>

<h1>{msg}</h1>
