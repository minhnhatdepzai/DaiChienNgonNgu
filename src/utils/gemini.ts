import { GoogleGenAI, Type, Schema } from '@google/genai';
import { AnyQuestion } from '../types/game';

const getGeminiApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  return typeof key === 'string' ? key.trim() : '';
};

const createGeminiClient = () => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      'Chưa cấu hình GEMINI_API_KEY. Game vẫn chơi được bằng câu hỏi có sẵn, nhưng chức năng Tạo Câu Hỏi Bằng AI cần API key.'
    );
  }

  return new GoogleGenAI({ apiKey });
};

export async function generateQuizFromText(text: string): Promise<AnyQuestion[]> {
  if (!text.trim()) {
    throw new Error('Vui lòng nhập tài liệu.');
  }

  const ai = createGeminiClient();

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        type: {
          type: Type.STRING,
          description: "Loại câu hỏi: 'MULTIPLE_CHOICE', 'FILL_BLANK', hoặc 'ORDER_WORDS'",
        },
        question: {
          type: Type.STRING,
          description: 'Nội dung câu hỏi hoặc từ cần dịch',
        },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: '4 đáp án, chỉ dùng cho MULTIPLE_CHOICE',
        },
        correctAnswer: {
          type: Type.STRING,
          description: 'Đáp án đúng cho MULTIPLE_CHOICE hoặc FILL_BLANK',
        },
        words: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: 'Các từ bị xáo trộn, chỉ dùng cho ORDER_WORDS',
        },
        correctOrder: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: 'Thứ tự từ đúng, chỉ dùng cho ORDER_WORDS',
        },
      },
      required: ['type', 'question'],
    },
  };

  const prompt = `Từ tài liệu sau đây, hãy tạo ra 10 câu hỏi đa dạng để kiểm tra kiến thức.

Yêu cầu:
- Có thể tạo câu hỏi trắc nghiệm, điền từ, sắp xếp từ.
- MULTIPLE_CHOICE phải có 4 đáp án.
- FILL_BLANK phải có correctAnswer.
- ORDER_WORDS phải có words và correctOrder.
- Nội dung câu hỏi nên rõ ràng, phù hợp với tài liệu.

Tài liệu:
${text}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '[]') as any[];

    return parsed.map((item, idx) => {
      const base = {
        id: `gen_${Date.now()}_${idx}`,
        type: item.type,
        question: item.question || '',
      };

      if (item.type === 'MULTIPLE_CHOICE') {
        const options = Array.isArray(item.options)
          ? [...item.options]
          : [item.correctAnswer || 'Đáp án đúng', 'Sai 1', 'Sai 2', 'Sai 3'];

        const correctAnswer = item.correctAnswer || options[0];

        if (!options.includes(correctAnswer)) {
          options[0] = correctAnswer;
        }

        return {
          ...base,
          type: 'MULTIPLE_CHOICE',
          options: options.sort(() => Math.random() - 0.5),
          correctAnswer,
        } as AnyQuestion;
      }

      if (item.type === 'FILL_BLANK') {
        return {
          ...base,
          type: 'FILL_BLANK',
          correctAnswer: item.correctAnswer || '',
        } as AnyQuestion;
      }

      if (item.type === 'ORDER_WORDS') {
        return {
          ...base,
          type: 'ORDER_WORDS',
          words: Array.isArray(item.words) ? item.words : [],
          correctOrder: Array.isArray(item.correctOrder) ? item.correctOrder : [],
        } as AnyQuestion;
      }

      return {
        ...base,
        type: 'FILL_BLANK',
        correctAnswer: item.correctAnswer || '',
      } as AnyQuestion;
    });
  } catch (err) {
    console.error('Lỗi khi tạo câu hỏi từ Gemini:', err);

    if (err instanceof Error && err.message.includes('GEMINI_API_KEY')) {
      throw err;
    }

    throw new Error('Không thể tạo câu hỏi bằng AI, vui lòng thử lại.');
  }
}
