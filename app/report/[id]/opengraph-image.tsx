import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";
import { AuditRecord, PublicAuditPayload } from "@/types/audit";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type ReportImageProps = {
  params: Promise<{ id: string }>;
};

async function getAudit(id: string) {
  try {
    const { data } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single<AuditRecord>();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function parsePublicPayload(record: AuditRecord): PublicAuditPayload | null {
  try {
    return JSON.parse(record.reason) as PublicAuditPayload;
  } catch {
    return null;
  }
}

export default async function Image({ params }: ReportImageProps) {
  const { id } = await params;
  const audit = await getAudit(id);
  const parsed = audit ? parsePublicPayload(audit) : null;

  const title = parsed
    ? `Save $${parsed.totalSavings.toFixed(0)}/month on your AI stack`
    : audit
      ? `Save $${audit.savings}/month on your AI stack`
      : "AI Spend Audit Report";
  const subtitle = parsed
    ? `${parsed.tools.length} tools audited • ${parsed.useCase} workflow • ${parsed.annualSavings.toFixed(0)}/year`
    : "See the savings opportunity in this StackSpend report.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, rgba(34,211,238,0.34), transparent 28%), linear-gradient(135deg, rgb(8,47,73), rgb(8,145,178), rgb(15,23,42))",
          padding: "56px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          StackSpend
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>{title}</div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <div style={{ display: "flex" }}>AI Spend Audit</div>
          <div style={{ display: "flex" }}>shareable report</div>
        </div>
      </div>
    ),
    size
  );
}
