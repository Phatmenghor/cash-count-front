// src/components/FullPageSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

const FullPageSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
       <Skeleton className="w-full h-full bg-blue-200 animate-pulse rounded-lg" />
    </div>
  );
};

export default FullPageSkeleton;
