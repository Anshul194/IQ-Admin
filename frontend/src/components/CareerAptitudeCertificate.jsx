import React from "react";

// Fixed palette matching the reference report, applied IN ORDER to bars/rows.
// This mirrors the printed template's own fixed color choices per row —
// only the underlying numbers are dynamic.
const INTEREST_PALETTE = [
  "#2E9E4C", // green      - Medical Science & Healthcare
  "#3E7CB1", // blue       - STEM
  "#F2994A", // orange     - Commerce, Business & Management
  "#8E5FC2", // purple     - Law, Politics & Social Work
  "#D6558C", // pink       - Teaching, Coaching, Counselling & Education
  "#3AA6A0", // teal       - Travel, Tourism, Hospitality, Aviation & Hotel Mgmt
  "#3E5C9A", // indigo     - Administrative & Civil Services
  "#3E7CB1", // blue       - Defence, Police, Sports & Yoga
  "#C0392B", // red/brown  - Design, Branding, Fine Arts & Creativity
  "#8A8F98", // slate      - Performing Arts, Media, Journalism & Languages
];

const ACADEMIC_PALETTE = ["#2E9E4C", "#3E7CB1", "#F2994A", "#8E5FC2", "#3AA6A0"];

function round2(n) {
  return Math.round(n * 100) / 100;
}

function computeInterestData(interestAreas) {
  const total = interestAreas.reduce((sum, a) => sum + Number(a.score || 0), 0) || 1;
  const withPct = interestAreas.map((a, i) => ({
    ...a,
    pct: round2((Number(a.score || 0) / total) * 100),
    color: INTEREST_PALETTE[i % INTEREST_PALETTE.length],
  }));
  return { rows: withPct, total: interestAreas.reduce((s, a) => s + Number(a.score || 0), 0) };
}

function computeAcademicData(academicSubjects) {
  const totalCorrect = academicSubjects.reduce((s, a) => s + Number(a.correct || 0), 0);
  const totalOutOf = academicSubjects.reduce((s, a) => s + Number(a.outOf || 0), 0) || 1;
  const withPct = academicSubjects.map((a, i) => ({
    ...a,
    pct: round2((Number(a.correct || 0) / (Number(a.outOf) || 1)) * 100),
    color: ACADEMIC_PALETTE[i % ACADEMIC_PALETTE.length],
  }));
  const grandAccuracy = round2(
    withPct.reduce((s, a) => s + a.pct, 0) / (withPct.length || 1)
  );
  return { rows: withPct, totalCorrect, totalOutOf, grandAccuracy };
}

function generateInterestInsight(rows) {
  if (!rows.length) return "";
  const sorted = [...rows].sort((a, b) => b.pct - a.pct);
  const top = sorted[0];
  const second = sorted[1];
  if (!second) {
    return `Your strongest inclination is towards ${top.label}.`;
  }
  return `Your strongest inclination is towards ${top.label}, followed by ${second.label}.`;
}

function generateAcademicInsight(rows) {
  if (!rows.length) return "";
  const sorted = [...rows].sort((a, b) => b.pct - a.pct);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  if (best.label === worst.label) {
    return `You have performed consistently in ${best.label}.`;
  }
  return `You have performed the best in ${best.label}, followed by ${sorted[1] ? sorted[1].label : ""}. Keep strengthening ${worst.label} to achieve a balanced overall performance.`;
}

export default function CareerAptitudeCertificate({
  studentName,
  className,
  logoSrc = "/src/assets/logo.png",
  badgeSrc = "/src/assets/badge.png",
  directorLeft = { name: "Mrs. Dhanshree Mali", title: "DIRECTOR", org: "NavodayaWali", signatureSrc: "/src/assets/dhanashree.png" },
  directorRight = { name: "Mr. Shrisagar Mali", title: "DIRECTOR", org: "NavodayaWali", signatureSrc: "/src/assets/shrisagar.png" },
  interestAreas = [],
  academicSubjects = [],
  brandName = "Navodaya Wale",
  brandTagline = "Hum Hi Navodaya Hai",
}) {
  const interest = computeInterestData(interestAreas);
  const academic = computeAcademicData(academicSubjects);
  const maxInterestPct = Math.max(...interest.rows.map((r) => r.pct), 1);
  const maxAcademicPct = Math.max(...academic.rows.map((r) => r.pct), 1);

  return (
    <div
      style={{
        width: 900,
        margin: "0 auto",
        background: "#ffffff",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#1a1a2e",
        padding: "24px 32px 32px",
        boxSizing: "border-box",
        border: "4px solid #1a3a6b",
        borderRadius: "8px"
      }}
    >
      {/* ---------------- HEADER ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "3px solid #f2994a",
          paddingBottom: 14,
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 180 }}>
          {logoSrc && (
            <img src={logoSrc} alt={brandName} style={{ width: 56, height: 56, objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none'; }} />
          )}
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a3a6b", lineHeight: 1.1 }}>
              {brandName}
            </div>
            <div style={{ fontSize: 10.5, color: "#f2994a", fontWeight: 600 }}>{brandTagline}</div>
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", letterSpacing: 0.5, lineHeight: 1.15 }}>
            CAREER APTITUDE
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", letterSpacing: 0.5, lineHeight: 1.15 }}>
            TEST REPORT
          </div>
        </div>

        <div style={{ minWidth: 180 }} />
      </div>

      {/* ---------------- STUDENT NAME BOX ---------------- */}
      <div
        style={{
          border: "1.5px solid #1a3a6b",
          borderRadius: 6,
          padding: "10px 16px",
          textAlign: "center",
          marginBottom: 20,
          fontSize: 15,
        }}
      >
        <div>
          <strong>Student Name : </strong>
          {studentName}
        </div>
        <div>
          <strong>Class : </strong>
          {className}
        </div>
      </div>

      {/* ---------------- SECTION 1 ---------------- */}
      <SectionHeader title="SECTION 1: INTEREST & PERSONALITY ASSESSMENT" />
      <p style={{ fontSize: 12, color: "#444", margin: "8px 0 12px" }}>
        This section evaluates your interests and personality traits across different career domains.
      </p>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Table */}
        <div style={{ flex: "0 0 46%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#1a3a6b", color: "#fff" }}>
                <th style={thStyle}>Career Interest Areas</th>
                <th style={thStyle}>Aptitude in Numbers</th>
                <th style={thStyle}>Aptitude in Percentage (%)</th>
              </tr>
            </thead>
            <tbody>
              {interest.rows.map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 0 ? "#f5f7fb" : "#ffffff" }}>
                  <td style={tdLabelStyle}>
                    {i + 1}. {row.label}
                  </td>
                  <td style={tdCenterStyle}>{row.score}</td>
                  <td style={tdCenterStyle}>{row.pct.toFixed(2)}%</td>
                </tr>
              ))}
              <tr style={{ background: "#fdf3e3", fontWeight: 700 }}>
                <td style={tdLabelStyle}>GRAND TOTAL</td>
                <td style={tdCenterStyle}>{interest.total}</td>
                <td style={tdCenterStyle}>100.00%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bar chart - fully dynamic widths from data */}
        <div style={{ flex: 1 }}>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#1a3a6b", marginBottom: 6 }}>
            Interest &amp; Personality Profile
          </div>
          <BarChart rows={interest.rows} maxPct={maxInterestPct} axisMax={20} />
        </div>
      </div>

      <InsightBox
        text={generateInterestInsight(interest.rows)}
      />

      {/* ---------------- SECTION 2 ---------------- */}
      <SectionHeader title="SECTION 2: ACADEMIC PROFICIENCY ASSESSMENT" />
      <p style={{ fontSize: 12, color: "#444", margin: "8px 0 12px" }}>
        This section evaluates your academic performance across core subjects.
      </p>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: "0 0 46%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#1a3a6b", color: "#fff" }}>
                <th style={thStyle}>Academic Subjects</th>
                <th style={thStyle}>Correct Answers (in Numbers)</th>
                <th style={thStyle}>Accuracy in Percentage (%)</th>
              </tr>
            </thead>
            <tbody>
              {academic.rows.map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 0 ? "#f5f7fb" : "#ffffff" }}>
                  <td style={tdLabelStyle}>
                    {i + 1}. {row.label}
                  </td>
                  <td style={tdCenterStyle}>{row.correct}</td>
                  <td style={tdCenterStyle}>{row.pct.toFixed(2)}%</td>
                </tr>
              ))}
              <tr style={{ background: "#fdf3e3", fontWeight: 700 }}>
                <td style={tdLabelStyle}>GRAND TOTAL</td>
                <td style={tdCenterStyle}>{academic.totalCorrect}</td>
                <td style={tdCenterStyle}>100.00%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#1a3a6b", marginBottom: 6 }}>
            Academic Proficiency Profile
          </div>
          <VerticalBarChart rows={academic.rows} maxPct={maxAcademicPct} axisMax={40} />
        </div>
      </div>

      <InsightBox text={generateAcademicInsight(academic.rows)} />

      {/* ---------------- FOOTER: signatures + badge ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginTop: 28,
          padding: "0 20px",
        }}
      >
        <SignatureBlock person={directorLeft} align="left" />
        {badgeSrc && <img src={badgeSrc} alt="Seal" style={{ width: 70, height: 70, objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none'; }} />}
        <SignatureBlock person={directorRight} align="right" />
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div
      style={{
        background: "#1a3a6b",
        color: "#fff",
        fontSize: 12.5,
        fontWeight: 700,
        padding: "6px 12px",
        borderRadius: 4,
        letterSpacing: 0.3,
      }}
    >
      {title}
    </div>
  );
}

function InsightBox({ text }) {
  return (
    <div
      style={{
        background: "#eef7f0",
        border: "1px solid #cfe8d6",
        borderRadius: 6,
        padding: "8px 14px",
        fontSize: 11.5,
        margin: "12px 0 20px",
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      <span>💡</span>
      <span>
        <strong>Insights:</strong> {text}
      </span>
    </div>
  );
}

function SignatureBlock({ person, align }) {
  if (!person) return <div style={{ width: 180 }} />;
  return (
    <div style={{ textAlign: "center", width: 180 }}>
      {person.signatureSrc && (
        <img
          src={person.signatureSrc}
          alt={`${person.name} signature`}
          style={{ height: 44, objectFit: "contain", marginBottom: 2 }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div style={{ fontSize: 12, fontWeight: 700, borderTop: "1px solid #999", paddingTop: 4 }}>
        {person.name}
      </div>
      <div style={{ fontSize: 10, letterSpacing: 0.5 }}>{person.title}</div>
      <div style={{ fontSize: 10 }}>{person.org}</div>
    </div>
  );
}

// Horizontal bar chart for Section 1 (dynamic widths, colors, and value labels)
function BarChart({ rows, maxPct, axisMax }) {
  const scaleMax = Math.max(axisMax, Math.ceil(maxPct / 5) * 5);
  return (
    <div style={{ fontSize: 9.5 }}>
      {rows.map((row) => (
        <div key={row.label} style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
          <div style={{ width: 150, textAlign: "right", paddingRight: 6, color: "#333" }}>
            {row.label}
          </div>
          <div style={{ flex: 1, background: "#f0f0f0", height: 12, position: "relative", borderRadius: 2 }}>
            <div
              style={{
                width: `${(row.pct / scaleMax) * 100}%`,
                background: row.color,
                height: "100%",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div style={{ width: 34, paddingLeft: 6, color: "#333" }}>{row.pct.toFixed(1)}</div>
        </div>
      ))}
      <div style={{ display: "flex", marginLeft: 150, marginTop: 4, fontSize: 9, color: "#888" }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ flex: 1, textAlign: i === 0 ? "left" : "right" }}>
            {Math.round((scaleMax / 4) * i)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Vertical bar chart for Section 2 (dynamic heights, colors, and value labels)
function VerticalBarChart({ rows, maxPct, axisMax }) {
  const scaleMax = Math.max(axisMax, Math.ceil(maxPct / 10) * 10);
  const chartHeight = 160;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          height: chartHeight,
          borderLeft: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
          paddingLeft: 8,
          gap: 14,
        }}
      >
        {rows.map((row) => (
          <div key={row.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ fontSize: 10, marginBottom: 2, color: "#333" }}>{row.pct.toFixed(2)}</div>
            <div
              style={{
                width: 32,
                height: `${(row.pct / scaleMax) * (chartHeight - 24)}px`,
                background: row.color,
                borderRadius: "3px 3px 0 0",
                transition: "height 0.4s ease",
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", paddingLeft: 8, gap: 14, marginTop: 4 }}>
        {rows.map((row) => (
          <div key={row.label} style={{ flex: 1, textAlign: "center", fontSize: 9.5, color: "#333" }}>
            {row.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const thStyle = { padding: "6px 8px", textAlign: "left", fontWeight: 600, border: "1px solid #1a3a6b" };
const tdLabelStyle = { padding: "5px 8px", border: "1px solid #ddd" };
const tdCenterStyle = { padding: "5px 8px", border: "1px solid #ddd", textAlign: "center" };
