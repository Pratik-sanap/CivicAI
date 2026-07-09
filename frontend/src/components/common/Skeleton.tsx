// ─── Skeleton primitives ───────────────────────────────────────────────────────
// Use these building blocks to compose loading states that exactly mirror the
// real layout so there's no layout shift when data arrives.

interface SkeletonProps {
  className?: string;
}

/** Single skeleton rectangle — use for text lines, images, and blocks. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

/** Skeleton for a stat/metric card (number + label). */
export function SkeletonCard() {
  return (
    <div className="rounded-[1.75rem] border border-white/8 bg-white/5 p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-9 w-20" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-3/4" />
    </div>
  );
}

/** Skeleton for a table row. */
export function SkeletonTableRow({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/8">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className={`h-4 ${i === 0 ? 'w-24' : 'w-full'}`} />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton for a list item card. */
export function SkeletonListItem() {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full flex-shrink-0" />
      </div>
    </div>
  );
}

/** Full-panel skeleton — fills a card with multiple random lines. */
export function SkeletonPanel({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3 p-5">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-2 h-7 w-48" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-3/5' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
