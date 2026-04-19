import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    
    // Mock OTP - instant demo (no Twilio needed)
    const otp = '123456';
    
    // Simulate SMS delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`📱 Mock SMS sent to ${phone}: OTP ${otp}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `OTP ${otp} sent to ${phone}!` 
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Send failed' 
    }, { status: 500 });
  }
}
