import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  recommendation?: React.ReactNode;
}

/**
 * Base responsive layout component for the Monterey Bay Conditions Dashboard.
 * 
 * Features:
 * - Mobile-first responsive design
 * - Recommendation card positioned at top for quick scanning
 * - Flexible grid layout for condition cards
 * - Adapts to mobile and desktop screen sizes
 * 
 * Validates: Requirements 7.1, 7.2, 7.3
 */
export default function DashboardLayout({ 
  children, 
  header, 
  recommendation 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header Section */}
      {header && (
        <div className="bg-white border-b border-blue-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 md:py-6">
            {header}
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        {/* Recommendation Card - Positioned at top for quick scanning */}
        {recommendation && (
          <div className="mb-4 md:mb-6">
            {recommendation}
          </div>
        )}

        {/* Condition Cards Grid - Responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {children}
        </div>
      </main>
    </div>
  );
}
