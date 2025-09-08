// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   console.log("ABLY_API_KEY length:", process.env.ABLY_API_KEY?.length);

//   try {
//     const ablyApiKey = process.env.ABLY_API_KEY;
    
//     if (!ablyApiKey) {
//       return NextResponse.json(
//         { error: 'ABLY_API_KEY not configured' },
//         { status: 500 }
//       );
//     }

//     // Get clientId from query parameters
//     const { searchParams } = new URL(request.url);
//     const clientId = searchParams.get('clientId') || `client-${Date.now()}`;

//     const ablyModule = await import('ably');
//     const Rest = ablyModule.Rest || ablyModule.default?.Rest;
    
//     const rest = new Rest({ key: ablyApiKey });

//     // Use the provided clientId
//     const tokenRequest = await rest.auth.createTokenRequest({
//       clientId: clientId,
//       capability: { '*': ['publish', 'subscribe', 'presence'] },
//       ttl: 3600000 // 1 hour
//     });

//     // Return the full tokenRequest object
//     return NextResponse.json(tokenRequest);

//   } catch (error) {
//     console.error('Ably token error:', error);
//     return NextResponse.json(
//       { error: 'Failed to create token request' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('API route invoked');  // This should show in logs
    const ablyApiKey = process.env.ABLY_API_KEY;
    console.log('ABLY_API_KEY length:', ablyApiKey?.length);

    if (!ablyApiKey) {
      return NextResponse.json(
        { error: 'ABLY_API_KEY not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || `client-${Date.now()}`;

    const ablyModule = await import('ably');
    const Rest = ablyModule.Rest || ablyModule.default?.Rest;
    const rest = new Rest({ key: ablyApiKey });

    const tokenRequest = await rest.auth.createTokenRequest({
      clientId,
      capability: { '*': ['publish', 'subscribe', 'presence'] },
      ttl: 3600000
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error('Ably token error:', error);
    return NextResponse.json(
      { error: 'Failed to create token request' },
      { status: 500 }
    );
  }
}
