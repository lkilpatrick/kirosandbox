/**
 * Loading Skeleton Component
 * 
 * Provides animated loading placeholders for better UX
 */

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle';
}

export function LoadingSkeleton({ className = '', variant = 'text' }: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    card: 'h-24 w-full',
    circle: 'h-12 w-12 rounded-full'
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}

export function CardLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <LoadingSkeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
