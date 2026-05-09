import Link from "next/link";

import {
  CalendarDays,
  Layers3,
} from "lucide-react";

type Batch = {
  id: string;

  batch_name: string;

  created_at?: string | null;

  years?: {
    year_name: string;
  } | null;
};

type BatchTableProps = {
  batches: Batch[];
};

export default function BatchTable({
  batches,
}: BatchTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">
          All Batches
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage all
          academic batches.
        </p>
      </div>

      {/* EMPTY */}
      {batches.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Layers3 className="h-8 w-8 text-muted-foreground" />
          </div>

          <h3 className="mt-6 text-xl font-semibold">
            No batches found
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            No batches available right now.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Batch Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Year
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Created Date
                </th>

                <th className="px-6 py-4 text-right text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {batches.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-t transition hover:bg-muted/30"
                >
                  {/* BATCH NAME */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                        <Layers3 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {batch.batch_name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          ID:{" "}
                          {batch.id.slice(
                            0,
                            8
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* YEAR */}
                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {batch.years
                      ?.year_name ||
                      "N/A"}
                  </td>

                  {/* CREATED DATE */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />

                      {batch.created_at
                        ? new Date(
                            batch.created_at
                          ).toLocaleDateString()
                        : "No date"}
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/admin/batches/${batch.id}`}
                      className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}