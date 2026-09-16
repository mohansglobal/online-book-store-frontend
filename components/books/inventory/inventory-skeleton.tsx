// Loading skeleton for inventory table
import React from "react";

export function InventorySkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <tr key={`skeleton-${index}`} className="animate-pulse">
          {/* SL */}
          <td className="px-4 py-4 text-center">
            <div className="mx-auto h-4 w-6 rounded bg-surface-soft" />
          </td>

          {/* Photo */}
          <td className="px-4 py-4">
            <div className="h-16 w-12 rounded-md bg-surface-soft" />
          </td>

          {/* ISBN */}
          <td className="px-4 py-4">
            <div className="h-6 w-28 rounded bg-surface-soft" />
          </td>

          {/* Book Info */}
          <td className="px-4 py-4">
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-surface-soft" />
              <div className="h-3 w-36 rounded bg-surface-soft" />
              <div className="h-3 w-20 rounded bg-surface-soft" />
            </div>
          </td>

          {/* Stock */}
          <td className="px-4 py-4 text-center">
            <div className="mx-auto h-7 w-24 rounded bg-surface-soft" />
          </td>

          {/* Status */}
          <td className="px-4 py-4 text-center">
            <div className="mx-auto h-6 w-10 rounded-full bg-surface-soft" />
          </td>

          {/* Actions */}
          <td className="px-4 py-4 pr-6 text-right">
            <div className="inline-flex gap-1.5">
              <div className="h-7 w-7 rounded bg-surface-soft" />
              <div className="h-7 w-7 rounded bg-surface-soft" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
