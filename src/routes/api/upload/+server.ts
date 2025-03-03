import { json, type RequestEvent } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../lib/prisma';

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

  const fileBuffer = await uploadData.file.arrayBuffer();
  const uploadDir = path.resolve('uploads');
  
  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = path.join(uploadDir, uploadData.file.name);
  fs.writeFileSync(filePath, Buffer.from(fileBuffer));

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
        filePath: filePath,
      },
    });

    // Return a response with the inserted data
    return json({
      message: 'File uploaded and data inserted successfully',
      filePath,
      insertedId: newUpload.id, 
      ...uploadData,
    });
  } catch (error) {
    console.error('Error inserting data into the database:', error);
    return json({ message: 'Error inserting data into the database' }, { status: 500 });
  }
};