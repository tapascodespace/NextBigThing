import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      console.error("GOOGLE_SCRIPT_URL not set");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error("Script returned error");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to save email" },
      { status: 500 }
    );
  }
}
