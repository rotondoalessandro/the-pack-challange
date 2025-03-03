import { json, type RequestEvent } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '../../../lib/prisma';

// Supabase client setup
const supabase = createClient('https://qfmjtvwzqnqsruzctqzx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbWp0dnd6cW5xc3J1emN0cXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTgzMjcsImV4cCI6MjA1NjU5NDMyN30.dNEK8sNKRH3lAFF7jh0aQN0nOuLqBHTKcTtkWnZAVI4');

// Request body interface
interface UploadFormData {
  title: string;
  description: string;
  category: string;
  language: string;
  provider: string;
  roles: string[];  // Array of roles
  file: File;
}

// POST handler
export const POST = async ({ request }: RequestEvent) => {
  const formData = await request.formData();

  // Cast the formData to the UploadFormData interface
  const uploadData: UploadFormData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    language: formData.get('language') as string,
    provider: formData.get('provider') as string,
    roles: formData.getAll('roles') as string[], // Multi-select as string array
    file: formData.get('file') as File,
  };

  if (!uploadData.file) {
    return json({ message: 'No file provided' }, { status: 400 });
  }

  // Convert file to a Buffer
  const fileBuffer = await uploadData.file.arrayBuffer();
  
  // Upload the file to Supabase Storage
  const { data, error } = await supabase
    .storage
    .from('the-pack-challenge')  // Replace with your bucket name
    .upload(uploadData.file.name, fileBuffer, {
      contentType: uploadData.file.type,
      upsert: true,  // Set to true to overwrite the file if it already exists
    });

  if (error) {
    console.error('Error uploading file to Supabase:', error);
    return json({ message: 'Error uploading file to Supabase' }, { status: 500 });
  }

  // Get the public URL of the uploaded file
  const fileUrl = supabase
  .storage
  .from('the-pack-challenge')
  .getPublicUrl(data.path).data.publicUrl;


  // Insert form data into PostgreSQL using Prisma
  try {
    const newUpload = await prisma.fileUpload.create({
      data: {
        title: uploadData.title,
        description: uploadData.description,
        category: uploadData.category,
        language: uploadData.language,
        provider: uploadData.provider,
        roles: uploadData.roles,
        filePath: fileUrl, // Store the public URL of the file
      },
    });

    // Return a response with the inserted data
    return json({
      message: 'File uploaded and data inserted successfully',
      fileUrl,
      insertedId: newUpload.id, 
      ...uploadData,
    });
  } catch (error) {
    console.error('Error inserting data into the database:', error);
    return json({ message: 'Error inserting data into the database' }, { status: 500 });
  }
};
