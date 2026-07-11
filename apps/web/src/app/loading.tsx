import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-4 h-12 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-5/6" />
      <Skeleton className="mb-2 h-4 w-4/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
