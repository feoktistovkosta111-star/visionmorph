// Серверная функция: проверяет готово ли видео
// Фронт вызывает её каждые 5 секунд

import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

export default async function handler(req, res) {
  const { request_id, endpoint } = req.query;

  if (!request_id || !endpoint) {
    return res.status(400).json({ error: 'Нужны request_id и endpoint' });
  }

  try {
    // Проверяем статус задачи в очереди fal.ai
    const status = await fal.queue.status(endpoint, {
      requestId: request_id,
      logs: false
    });

    // Если задача завершена — забираем результат
    if (status.status === 'COMPLETED') {
      const result = await fal.queue.result(endpoint, {
        requestId: request_id
      });
      return res.status(200).json({
        status: 'completed',
        videoUrl: result.data.video.url
      });
    }

    // Иначе говорим что ещё в процессе
    return res.status(200).json({
      status: status.status.toLowerCase()  // 'in_progress' или 'in_queue'
    });

  } catch (error) {
    console.error('Ошибка проверки статуса:', error);
    return res.status(500).json({
      error: 'Не удалось проверить статус',
      details: error.message
    });
  }
}