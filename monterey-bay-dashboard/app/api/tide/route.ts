/**
 * NOAA Tide Data API Route
 * 
 * Proxies requests to NOAA CO-OPS to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  try {
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${searchParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MontereyBayDashboard/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`NOAA API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching tide data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tide data' },
      { status: 500 }
    );
  }
}
