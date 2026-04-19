import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    
    // Mock verify (always true for 123456)
    if (code === '123456') {
      // Save session (real: JWT/cookie)
      console.log(`✅ ${phone} verified`);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid OTP' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Verify failed' }, { status: 500 });
  }
}

