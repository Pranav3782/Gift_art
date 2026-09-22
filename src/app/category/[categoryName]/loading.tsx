import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Skeleton className="h-8 w-64 rounded-xl mb-8" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-xl" />
              <Skeleton className="h-4 w-1/2 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
