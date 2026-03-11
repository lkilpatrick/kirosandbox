/**
 * NDBC Buoy Data API Route
 * 
 * Proxies requests to NDBC to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stationId = searchParams.get('station') || '46042';
  
  try {
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MontereyBayDashboard/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`NDBC API error: ${response.status}`);
    }
    
    const data = await response.text();
    
    return NextResponse.json({ data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching buoy data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buoy data' },
      { status: 500 }
    );
  }
}
