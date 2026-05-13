import { NextResponse } from "next/server";

type LeadConfirmationPayload = {
  email?: string;
  company?: string;
  role?: string;
  teamSize?: string;
  savings?: number;
  reportLink?: string;
};

function buildEmailHtml(payload: LeadConfirmationPayload) {
  const companyLine = payload.company ? `<p><strong>Company:</strong> ${payload.company}</p>` : "";
  const roleLine = payload.role ? `<p><strong>Role:</strong> ${payload.role}</p>` : "";
  const teamSizeLine = payload.teamSize
    ? `<p><strong>Team size:</strong> ${payload.teamSize}</p>`
    : "";
  const reportLine = payload.reportLink
    ? `<p><a href="${payload.reportLink}">Open your shareable audit report</a></p>`
    : "";
  const credexLine =
    typeof payload.savings === "number" && payload.savings > 500
      ? "<p>Credex may reach out because your audit showed a larger savings opportunity.</p>"
      : "<p>If new optimization opportunities show up in your stack later, we will let you know.</p>";

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h1 style="font-size: 22px;">Your StackSpend audit is ready</h1>
      <p>Thanks for running an AI spend audit with StackSpend.</p>
      <p><strong>Estimated monthly savings:</strong> $${(payload.savings ?? 0).toFixed(2)}</p>
      ${companyLine}
      ${roleLine}
      ${teamSizeLine}
      ${reportLine}
      ${credexLine}
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as LeadConfirmationPayload;

    if (!payload.email) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

    if (!resendKey || !fromEmail) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const reportLink = payload.reportLink?.startsWith("http")
      ? payload.reportLink
      : payload.reportLink
        ? `${siteUrl}${payload.reportLink}`
        : undefined;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: payload.email,
        subject: "Your StackSpend audit result",
        html: buildEmailHtml({
          ...payload,
          reportLink,
        }),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
