import { NextRequest } from "next/server";
import { paymentSessions } from "@/lib/mock/paymentSessions";
import { voucherPaymentSessions } from "@/lib/mock/voucherPaymentSessions";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const bookingSession = paymentSessions[sessionId];
  if (bookingSession) {
    return Response.json(bookingSession);
  }
  const voucherSession = voucherPaymentSessions[sessionId];
  if (voucherSession) {
    return Response.json({
      ...voucherSession,
      type: "voucher",
    });
  }
  return Response.json({ error: "Session not found" }, { status: 404 });
}
