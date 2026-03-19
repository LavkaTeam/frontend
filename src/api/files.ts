import { apiUrl } from './fetchData';

// Інтерфейс відповіді (може змінитися, коли зробиш бек)
interface FileUploadResponse {
  url: string;
  filename: string;
}

export const uploadDocument = async (file: File): Promise<string> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token provided');

  const formData = new FormData();
  formData.append('file', file); // Назва поля, яку чекатиме multer

  // ПОКИ ЩО ЗАКОМЕНТОВАНО, бо немає ендпоінту
  /*
  const response = await fetch(`${apiUrl}/files/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type не ставимо, браузер сам поставить boundary
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload document');
  }

  const data: FileUploadResponse = await response.json();
  return data.url;
  */

  // МОК (Імітація) для фронтенду, щоб ти бачив UI
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock upload document:', file.name);
      // Повертаємо фейковий URL або blob-url для прев'ю
      resolve(URL.createObjectURL(file));
    }, 1000);
  });
};
