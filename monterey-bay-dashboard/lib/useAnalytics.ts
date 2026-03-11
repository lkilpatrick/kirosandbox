/**
 * Analytics Hook
 * 
 * Custom hook for tracking page views and events with Firebase Analytics
 */

import { useEffect } from 'react';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

export function usePageView(pageName: string) {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, [pageName]);
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}

export function trackLocationChange(locationId: string, locationName: string) {
  trackEvent('location_selected', {
    location_id: locationId,
    location_name: locationName
  });
}

export function trackActivityChange(activity: string) {
  trackEvent('activity_selected', {
    activity_type: activity
  });
}

export function trackDataLoad(dataType: string, success: boolean) {
  trackEvent('data_loaded', {
    data_type: dataType,
    success: success
  });
}
