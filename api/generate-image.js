// Серверная функция: генерация изображений через fal.ai (Nano Banana 2)

import { fal } from "@fal-ai/client";

// Настраиваем доступ к fal.ai
fal.config({
  credentials: process.env.FAL_KEY,
});

export default async function handler(req, res) {
  // Принимаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST запросы' });
  }

  try {
    const { prompt, images } = req.body;

    // Проверяем что промпт есть
    if (!prompt) {
      return res.status(400).json({ error: 'Опиши что хочешь получить' });
    }

    let result;

    // Если есть фото — режим редактирования с референсами
    if (images && images.length > 0) {
      result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
        input: {
          prompt: prompt,
          image_urls: images,
        },
      });
    } else {
      // Если фото нет — генерация из текста
      result = await fal.subscribe("fal-ai/nano-banana-2", {
        input: {
          prompt: prompt,
        },
      });
    }

    // Возвращаем ссылку на готовое изображение
    return res.status(200).json({
      success: true,
      imageUrl: result.data.images[0].url
    });

  } catch (error) {
    console.error('Ошибка генерации:', error);
    return res.status(500).json({
      error: 'Не удалось создать изображение',
      details: error.message
    });
  }
}