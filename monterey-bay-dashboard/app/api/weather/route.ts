/**
 * NWS Weather Data API Route
 * 
 * Proxies requests to National Weather Service to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat') || '36.6002';
  const lon = searchParams.get('lon') || '-121.8947';
  
  try {
    // Get the forecast office and grid coordinates
    const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const pointResponse = await fetch(pointUrl, {
      headers: {
        'User-Agent': 'MontereyBayDashboard/1.0',
        'Accept': 'application/json'
      }
    });
    
    if (!pointResponse.ok) {
      throw new Error(`NWS API error: ${pointResponse.status}`);
    }
    
    const pointData = await pointResponse.json();
    const forecastUrl = pointData.properties.forecast;
    
    // Get the forecast
    const forecastResponse = await fetch(forecastUrl, {
      headers: {
        'User-Agent': 'MontereyBayDashboard/1.0',
        'Accept': 'application/json'
      }
    });
    
    if (!forecastResponse.ok) {
      throw new Error(`NWS Forecast API error: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    return NextResponse.json(forecastData, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
      }
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
