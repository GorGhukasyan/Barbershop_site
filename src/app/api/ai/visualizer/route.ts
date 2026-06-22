import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini/client';
import { buildVisualizerPrompt } from '@/lib/gemini/prompts';
import { getHairstyleById } from '@/lib/hairstyles';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const photo = formData.get('photo') as File | null;
    const hairstyleId = formData.get('hairstyleId') as string | null;

    if (!photo || !hairstyleId) {
      return NextResponse.json(
        { success: false, error: 'Missing photo or hairstyleId' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(photo.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Use JPEG, PNG or WebP.' },
        { status: 400 }
      );
    }

    if (photo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Max 5MB.' },
        { status: 400 }
      );
    }

    const hairstyle = getHairstyleById(hairstyleId);
    if (!hairstyle) {
      return NextResponse.json(
        { success: false, error: 'Invalid hairstyle ID' },
        { status: 400 }
      );
    }

    const photoBuffer = await photo.arrayBuffer();
    const photoBase64 = Buffer.from(photoBuffer).toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = buildVisualizerPrompt(hairstyle.geminiPrompt);

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: photo.type as 'image/jpeg' | 'image/png' | 'image/webp',
          data: photoBase64,
        },
      },
      { text: prompt },
    ]);

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));

    if (!imagePart || !(imagePart as any).inlineData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textPart = parts.find((p: any) => p.text);
      console.error('[Visualizer] No image in response:', (textPart as any)?.text);
      return NextResponse.json(
        { success: false, error: 'AI could not generate image. Please try again.' },
        { status: 500 }
      );
    }

    const inlineData = (imagePart as any).inlineData;

    return NextResponse.json({
      success: true,
      data: {
        imageBase64: inlineData.data,
        mimeType: inlineData.mimeType,
        hairstyleName: hairstyle.nameEn,
      },
    });
  } catch (error) {
    console.error('[POST /api/ai/visualizer]', error);

    if ((error as Record<string, unknown>)?.status === 429) {
      return NextResponse.json(
        { success: false, error: 'AI is busy. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate hairstyle. Please try again.' },
      { status: 500 }
    );
  }
}
