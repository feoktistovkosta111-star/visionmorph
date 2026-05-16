// Серверная функция: запуск генерации видео через Kling 3.0
// Отправляет задачу в очередь fal.ai и возвращает request_id

import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST запросы' });
  }

  try {
    const { mode, prompt, image } = req.body;

    // Проверки
    if (mode === 'text' && !prompt) {
      return res.status(400).json({ error: 'Опиши видео' });
    }
    if (mode === 'photo' && !image) {
      return res.status(400).json({ error: 'Загрузи фото' });
    }

    let endpoint, input;

    if (mode === 'text') {
      // Видео из текста
      endpoint = 'fal-ai/kling-video/v3/standard/text-to-video';
      input = {
        prompt: prompt,
        duration: "5"
      };
    } else {
      // Видео из фото (оживление)
      endpoint = 'fal-ai/kling-video/v3/standard/image-to-video';
      input = {
        start_image_url: image,
        prompt: prompt || "natural motion, gentle movement",
        duration: "5"
      };
    }

    // Отправляем в очередь — возвращается request_id
    const { request_id } = await fal.queue.submit(endpoint, { input });

    return res.status(200).json({
      success: true,
      request_id,
      endpoint
    });

  } catch (error) {
    console.error('Ошибка отправки в очередь:', error);
    return res.status(500).json({
      error: 'Не удалось запустить генерацию',
      details: error.message
    });
  }
}