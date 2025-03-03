<script lang="ts">
  import { onMount } from 'svelte'; // Import onMount

  import NavBar from "./NavBar.svelte";
  import FileUpload from "./FileUpload.svelte";

  interface Resource {
    id: number;
    title: string;
    description: string;
    category: string;
    language: string;
    provider: string;
    roles: string[];
    filePath: string;
    type: string;
  }

  let resources: Resource[] = [];
  let showFileUpload: boolean = false;

  // Track the sorting state (by which field and in what order)
  let sortField: keyof Resource = 'title'; // Default to sorting by title
  let sortOrder: 'asc' | 'desc' = 'asc'; // Default to ascending order

  // Fetch resources from the API
  async function fetchResources() {
    try {
      const response = await fetch('/api/resources');
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      resources = data.map((resource: any) => ({
        ...resource,
        type: getResourceType(resource.filePath),
      }));
      sortResources(); // Sort resources initially after fetching
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  }

  // Function to determine the file type based on file extension
  function getResourceType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (!extension) return 'Unknown';
    const types: { [key: string]: string } = {
      pdf: 'Document',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image',
      mp4: 'Video',
      mp3: 'Audio',
      txt: 'Text',
      html: 'HTML',
    };
    return types[extension] || 'Other';
  }

  // Function to toggle sorting order and field
  function toggleSort(field: keyof Resource) {
    if (sortField === field) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortOrder = 'asc'; // Reset to ascending order when changing the field
    }
    sortResources();
  }

  // Function to sort the resources based on the current sort state
  function sortResources() {
    resources = [...resources].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      // Check if both fields are numbers
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }

      // Handle sorting based on string values (e.g., title)
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortOrder === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      // Handle cases where fields might be a mix of types or unsupported types
      return 0; // No change if types are incompatible or not supported
    });
  }

  // Use onMount to call fetchResources when the component is mounted on the client side
  onMount(() => {
    fetchResources();
  });

  function toggleFileUpload() {
    showFileUpload = !showFileUpload;
  }

  function onUploadComplete() {
    showFileUpload = false;
    fetchResources(); // Reload resources after upload
  }
</script>

<NavBar />

<div class="max-w-7xl mx-auto mt-10 p-6 shadow-lg rounded-lg">
  <button
    on:click={toggleFileUpload}
    class="mb-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
  >
    Upload Resource
  </button>

  {#if showFileUpload}
    <div class="fixed inset-0 flex items-start justify-center z-50 overflow-y-auto">
      <div class="bg-white p-6 rounded shadow-lg max-w-md w-full relative mt-20 mb-20 max-h-screen">
        <button
          on:click={toggleFileUpload}
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <FileUpload on:uploadComplete={onUploadComplete} />
      </div>
    </div>
  {/if}

  {#if resources.length > 0}
    <div class="overflow-x-auto max-w-full mx-auto px-4">
      <table class="min-w-full border-none table-auto">
        <thead>
          <tr>
            <th
              class="px-6 py-3 border-b text-left text-sm font-bold text-gray-700 cursor-pointer"
              on:click={() => toggleSort('title')}
            >
              Title
              {#if sortField === 'title'}
                {#if sortOrder === 'asc'}
                  <span class="ml-2">&#x2191;</span>
                {:else}
                  <span class="ml-2">&#x2193;</span>
                {/if}
              {/if}
            </th>
            <th class="px-6 py-3 border-b text-left text-sm font-bold text-gray-700">Description</th>
            <th class="px-6 py-3 border-b text-left text-sm font-bold text-gray-700">Category</th>
            <th class="px-6 py-3 border-b text-left text-sm font-bold text-gray-700">Language</th>
            <th class="px-6 py-3 border-b text-left text-sm font-bold text-gray-700">Provider</th>
            <th class="px-6 py-3 border-b text-left text-sm font-bold text-gray-700">Roles</th>
            <th class="px-6 py-3 border-b text-left text-sm font-bold text-gray-700">Type</th>
            <th class="px-6 py-3 border-b text-left text-sm font-bold text-gray-700">Path</th>
          </tr>
        </thead>
        <tbody>
          {#each resources as resource}
            <tr class="border-b hover:bg-gray-100">
              <td class="px-6 py-4 text-sm text-gray-700">{resource.title}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{resource.description}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{resource.category}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{resource.language}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{resource.provider}</td>
              <td class="px-6 py-4 text-sm text-gray-700">
                {#each resource.roles as role}
                  <span class="mr-2">{role}</span>
                {/each}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{resource.type}</td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <a href={resource.filePath} target="_blank" class="text-blue-500 hover:text-blue-700">{resource.filePath}</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <p>No resources uploaded yet.</p>
  {/if}
</div>
