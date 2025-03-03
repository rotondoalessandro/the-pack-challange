import { json } from '@sveltejs/kit';
import { prisma } from '../../../lib/prisma';

// GET handler
export const GET = async () => {
  try {
    const resources = await prisma.fileUpload.findMany();
    return json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return json({ message: 'Error fetching resources' }, { status: 500 });
  }
};
