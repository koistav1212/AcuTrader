import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;
  const searchParams = req.nextUrl.searchParams;
  const period = searchParams.get("period") || "1d";

  try {
    // The user's backend server
    const backendUrl = `http://localhost:4000/api/market/historical/${symbol}?period=${period}`;
    console.log(`Forwarding request to: ${backendUrl}`);

    const res = await fetch(backendUrl, {
        headers: {
            // Forward headers if needed, or just standard content type
            "Content-Type": "application/json",
        },
        cache: 'no-store' 
    });

    if (!res.ok) {
        return NextResponse.json(
            { error: `Backend responded with ${res.status}` },
            { status: res.status }
        );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error forwarding to backend:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from backend", details: error.message },
      { status: 500 }
    );
  }
}

