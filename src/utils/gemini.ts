import { GoogleGenAI, Type, Schema } from '@google/genai';
import { AnyQuestion } from '../types/game';

// The AI Studio environment provides the GEMINI_API_KEY globally via Vite define
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuizFromText(text: string): Promise<AnyQuestion[]> {
  if (!text.trim()) throw new Error("Vui lòng nhập tài liệu.");
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "Loại câu hỏi: 'MULTIPLE_CHOICE', 'FILL_BLANK', hoặc 'ORDER_WORDS'" },
        question: { type: Type.STRING, description: "Nội dung câu hỏi hoặc từ cần dịch" },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 đáp án (chỉ dùng cho MULTIPLE_CHOICE)" },
        correctAnswer: { type: Type.STRING, description: "Đáp án đúng (chuỗi nguyên bản cho MULTIPLE_CHOICE hoặc FILL_BLANK)" },
        words: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Các từ bị xáo trộn (chỉ dùng cho ORDER_WORDS)" },
        correctOrder: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Thứ tự từ đúng (chỉ dùng cho ORDER_WORDS)" }
      },
      required: ["type", "question"]
    }
  };

  const prompt = `Từ tài liệu sau đây, hãy tạo ra 10 câu hỏi đa dạng (Trắc nghiệm, Điền từ, Sắp xếp từ hoặc Dịch) để kiểm tra kiến thức.\nVới dạng ORDER_WORDS (sắp xếp), hãy tách câu thành các từ nhỏ.\n\nTài liệu:\n${text}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.7
      }
    });

    const parsed = JSON.parse(response.text || "[]") as any[];
    
    // Map & validate IDs
    return parsed.map((item, idx) => {
      const base = {
        id: `gen_${Date.now()}_${idx}`,
        type: item.type,
        question: item.question
      };

      if (item.type === 'MULTIPLE_CHOICE') {
        const options = item.options || [item.correctAnswer, 'Sai 1', 'Sai 2', 'Sai 3'];
        // Ensure correctAnswer is in options
        if (!options.includes(item.correctAnswer)) options[0] = item.correctAnswer;
        return { ...base, options: options.sort(() => Math.random() - 0.5), correctAnswer: item.correctAnswer } as AnyQuestion;
      }
      if (item.type === 'FILL_BLANK') {
        return { ...base, correctAnswer: item.correctAnswer || '' } as AnyQuestion;
      }
      if (item.type === 'ORDER_WORDS') {
        return { ...base, words: item.words || [], correctOrder: item.correctOrder || [] } as AnyQuestion;
      }
      
      // Fallback
      return { ...base, type: 'FILL_BLANK', correctAnswer: item.correctAnswer || '' } as AnyQuestion;
    });

  } catch (err) {
    console.error("Lỗi khi tạo câu hỏi từ Gemini:", err);
    throw new Error("Không thể tạo câu hỏi, vui lòng thử lại.");
  }
}
