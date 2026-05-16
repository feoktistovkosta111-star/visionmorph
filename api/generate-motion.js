// Серверная функция: запуск Motion Control через Kling 3.0
// Принимает фото персонажа + референс-видео, переносит движения

import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST запросы' });
  }

  try {
    const { image, video, bgFromVideo } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Загрузи фото персонажа' });
    }
    if (!video) {
      return res.status(400).json({ error: 'Загрузи референс-видео' });
    }

    const endpoint = 'fal-ai/kling-video/v3/standard/motion-control';

    const input = {
      image_url: image,
      video_url: video,
      character_orientation: bgFromVideo ? 'video' : 'image'
    };

    // Отправляем в очередь
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