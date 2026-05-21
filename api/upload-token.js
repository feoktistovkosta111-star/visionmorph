// Серверная функция: выдаёт временный токен для прямой загрузки в Vercel Blob
// Браузер получает токен и грузит файл напрямую, минуя нашу функцию

import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST запросы' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'video/mp4',
            'video/quicktime',
            'video/webm',
            'video/x-msvideo',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
          ],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200 МБ максимум
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Файл загружен:', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Ошибка генерации токена:', error);
    return res.status(400).json({ error: error.message });
  }
}