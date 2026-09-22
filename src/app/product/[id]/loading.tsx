import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-4 w-32 rounded-xl" />
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-xl" />
            <Skeleton className="h-4 w-5/6 rounded-xl" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 flex-1 rounded-2xl" />
              <Skeleton className="h-14 w-14 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
