<script lang='ts'>
  export let rows: any;
  const six = 'border-b bg-white dark:border-neutral-500 dark:bg-neutral-600';
  const seven = 'border-b bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700';
</script>
<div class="flex flex-col">
  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div class="overflow-hidden">
        <table class="min-w-full text-left text-sm font-light">
          <thead
            class="border-b bg-white font-medium dark:border-neutral-500 dark:bg-neutral-600">
            <tr>
              <th scope="col" class="px-6 py-4">#</th>
              <th scope="col" class="px-6 py-4">First name</th>
              <th scope="col" class="px-6 py-4">Last name</th>
              <th scope="col" class="px-6 py-4">Birth date</th>
              <th scope="col" class="px-6 py-4">Position</th>
              <th scope="col" class="px-6 py-4">Number</th>
              <th scope="col" class="px-6 py-4">Country</th>
            </tr>
          </thead>
          <tbody>
            {#each rows as row, i}
              <tr class="{i%2?six:seven}">
                  <td class="whitespace-nowrap px-6 py-4 font-medium">{row.id}</td>
                  <td class="whitespace-nowrap px-6 py-4">{row.firstname}</td>
                  <td class="whitespace-nowrap px-6 py-4">{row.lastname}</td>
                  <td class="whitespace-nowrap px-6 py-4">{row.birthdate}</td>
                  <td class="whitespace-nowrap px-6 py-4">{row.position}</td>
                  <td class="whitespace-nowrap px-6 py-4">{row.numero}</td>
                  <td class="whitespace-nowrap px-6 py-4">{row.country}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>