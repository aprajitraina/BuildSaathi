interface ListSkeletonProps {
  rows?: number;
  rowClassName?: string;
}

export function ListSkeleton({ rows = 4, rowClassName = "h-16" }: ListSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${rowClassName} animate-pulse rounded-lg bg-muted`} />
      ))}
    </div>
  );
}
