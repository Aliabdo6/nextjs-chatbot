import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    const chatCompletion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model: "llama3-8b-8192",
      });

    return NextResponse.json({
      response:
        chatCompletion.choices[0]?.message
          ?.content || "",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
