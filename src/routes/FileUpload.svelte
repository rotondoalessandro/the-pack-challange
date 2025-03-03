<script lang="ts">
  let title: string = '';
  let description: string = '';
  let category: string = '';
  let language: string = 'en';
  let provider: string = '';
  let roles: string[] = [];
  let file: File | null = null;

  function handleFileChange(event: Event): void {
  const input = event.target;
    if (input instanceof HTMLInputElement && input.files && input.files.length > 0) {
      file = input.files[0];
    }
  }

  async function handleUpload(): Promise<void> {
    if (!file) {
      alert('Please select a file!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('language', language);
    formData.append('provider', provider);
    formData.append('roles', roles.join(', '));
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('File uploaded successfully!');
    } else {
      alert('Failed to upload file.');
    }
  }
</script>

<h1 class="text-lg text-center mb-6">Upload Resource</h1>

<form class="max-w-lg mx-auto bg-white p-6 shadow-lg rounded-lg space-y-4" on:submit|preventDefault={handleUpload}>
  <input type="text" bind:value={title} placeholder="Title" required class="w-full p-3 border border-gray-300 rounded-lg" />
  
  <textarea bind:value={description} placeholder="Description" required class="w-full p-3 border border-gray-300 rounded-lg"></textarea>
  
  <select bind:value={category} required class="w-full p-3 border border-gray-300 rounded-lg">
    <option value="">Select Category</option>
    <option value="Leadership">Leadership</option>
    <option value="Managing Complexity">Managing Complexity</option>
  </select>
  
  <select bind:value={language} required class="w-full p-3 border border-gray-300 rounded-lg">
    <option value="en">English</option>
    <option value="it">Italian</option>
    <option value="es">Spanish</option>
  </select>
  
  <input type="text" bind:value={provider} placeholder="Provider" required class="w-full p-3 border border-gray-300 rounded-lg" />
  
  <select bind:value={roles} multiple required class="w-full p-3 border border-gray-300 rounded-lg">
    <option value="mentor">Mentor</option>
    <option value="mentee">Mentee</option>
    <option value="coach">Coach</option>
    <option value="coachee">Coachee</option>
  </select>
  
  <input type="file" on:change={handleFileChange} required class="w-full p-3 border border-gray-300 rounded-lg" />
  
  <button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-200">Upload</button>
</form>
