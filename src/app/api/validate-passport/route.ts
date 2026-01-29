import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const ACCEPTED_FORMATS = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return NextResponse.json(
        {
          isValid: false,
          issues: [`File type ${file.type} not accepted`],
          feedback: 'Please upload a PDF, JPG, or PNG file of your passport bio page.',
          severity: 'error',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          isValid: false,
          issues: ['File size exceeds 10MB limit'],
          feedback: 'Please compress your file or rescan at a lower resolution (300 DPI recommended).',
          severity: 'error',
        },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Set mime type based on file type
    let mimeType = file.type;

    // Gemini handles PDFs directly
    if (file.type === 'application/pdf') {
      mimeType = 'application/pdf';
    } else if (file.type === 'image/png') {
      mimeType = 'image/png';
    } else {
      mimeType = 'image/jpeg';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are reviewing a passport bio page upload for an O-1 visa application. Analyze this document and provide feedback.

Check for:
1. Is this actually a passport bio page (the page with photo, name, passport number)? Not a driver's license, ID card, visa page, or other document.
2. Is the scan/image clear and readable (not blurry, dark, or low quality)? For USCIS, it should be at least 300 DPI quality.
3. Are all four corners/edges visible (not cropped)? The entire bio page must be visible.
4. Can you clearly identify: full name, passport number, date of birth, photo, issue date, and expiry date?
5. Is the passport expired or expiring within the next 6 months from today (${new Date().toISOString().split('T')[0]})?
6. Is this a color scan? (Black and white scans are typically not accepted)

If it is a SPECIMEN (sample) passport, please count that as valid if it fits the above criteria, and just make a note that it is a sample passport that has passed for demo purposes.

Respond in JSON format:
{
  "isValid": boolean,
  "issues": ["list of specific issues found"],
  "feedback": "A helpful message to the user explaining what needs to be fixed or confirming it looks good",
  "severity": "error" | "warning" | "success"
}

Severity guidelines:
- "error": Critical issues that prevent acceptance (wrong document, expired, severely blurry, cropped, missing key info)
- "warning": Minor issues that should be fixed but might be acceptable (slight quality issues, expiring soon but not yet expired)
- "success": Document meets all requirements

If valid, praise the submission and confirm key details are visible. If invalid, be specific about what's wrong and how to fix it (e.g., "Rescan at higher resolution" or "Ensure all four corners are visible").`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        {
          error: 'Could not parse validation response',
          rawResponse: text,
        },
        { status: 500 }
      );
    }

    const validation = JSON.parse(jsonMatch[0]);

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Passport validation error:', error);
    return NextResponse.json(
      {
        isValid: false,
        issues: ['Validation system error'],
        feedback: 'An error occurred while validating your passport. Please try again or contact support if the issue persists.',
        severity: 'error',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
