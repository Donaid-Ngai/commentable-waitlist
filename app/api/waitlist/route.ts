import { NextResponse } from "next/server";

const MAILERLITE_SUBSCRIBERS_ENDPOINT = "https://connect.mailerlite.com/api/subscribers";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!apiKey || !groupId) {
    return NextResponse.json(
      { message: "Waitlist is not configured yet. Add MailerLite credentials first." },
      { status: 500 }
    );
  }

  const response = await fetch(MAILERLITE_SUBSCRIBERS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      groups: [groupId],
    }),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { message?: string; errors?: Record<string, string[]> }
      | null;

    const firstFieldError = errorBody?.errors
      ? Object.values(errorBody.errors).flat()[0]
      : undefined;

    return NextResponse.json(
      {
        message:
          firstFieldError ??
          errorBody?.message ??
          "MailerLite rejected the request. Check the API key and group ID.",
      },
      { status: response.status }
    );
  }

  return NextResponse.json({ message: "You are on the waitlist." }, { status: 201 });
}
