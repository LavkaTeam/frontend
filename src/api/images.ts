import { apiUrl } from './fetchData';

interface UploadResponse {
  id: string;
  url: string;
  publicId: string;
}

export const uploadImage = async (file: Blob): Promise<string> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token provided');
  }

  const formData = new FormData();
  formData.append('files', file);

  try {
    const response = await fetch(`${apiUrl}/images/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data: UploadResponse | UploadResponse[] = await response.json();

    if (Array.isArray(data)) {
      if (data.length > 0) return data[0].url;
      throw new Error('No url received from server');
    } else {
      return data.url;
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};
