import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
      </div>

      <Skeleton className="h-96 w-full" />
    </div>
  )
}
