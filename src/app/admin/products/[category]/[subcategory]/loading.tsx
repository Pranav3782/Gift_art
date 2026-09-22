import { Skeleton } from "@/components/ui/skeleton";

export default function SubcategoryLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-xl" />
          <Skeleton className="h-8 w-56 rounded-xl" />
        </div>
        <Skeleton className="h-14 w-40 rounded-2xl" />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-14 rounded-2xl col-span-3" />
            <Skeleton className="h-12 rounded-xl col-span-3" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-32 rounded-xl col-span-3" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-slate-50">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36 rounded-xl" />
                  <Skeleton className="h-3 w-24 rounded-xl" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-20 rounded-xl" />
                <Skeleton className="h-8 w-8 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
