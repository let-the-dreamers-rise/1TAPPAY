import { NextRequest, NextResponse } from 'next/server';

/**
 * RPC Proxy API Route
 * 
 * Proxies JSON-RPC requests to the Etherlink Shadownet node.
 * This bypasses browser CORS restrictions that can cause 403 errors
 * when making direct RPC calls from the client side.
 */

const RPC_ENDPOINTS = [
    'https://node.shadownet.etherlink.com',
    'https://relay.shadownet.etherlink.com',
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Try each endpoint until one works
        for (const endpoint of RPC_ENDPOINTS) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data);
                }
            } catch {
                // Try next endpoint
                continue;
            }
        }

        return NextResponse.json(
            { error: 'All RPC endpoints failed' },
            { status: 502 }
        );
    } catch {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }
}
