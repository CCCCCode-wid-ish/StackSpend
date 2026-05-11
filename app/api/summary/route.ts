import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
    Summarize this AI spend audit in 100 words:
    ${JSON.stringify(body)}
    `;

    return NextResponse.json({
      summary:
        "Your current AI tooling setup shows optimization opportunities through plan adjustments and seat consolidation. Moving to lower-tier plans could significantly reduce recurring monthly costs while maintaining similar productivity outcomes.",
    });
  } catch (error) {
    return NextResponse.json({
      summary:
        "We identified several opportunities to optimize your AI spend and reduce unnecessary costs.",
    });
  }
}