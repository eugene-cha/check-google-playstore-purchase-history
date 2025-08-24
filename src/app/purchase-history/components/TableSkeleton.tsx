'use client';

export default function TableSkeleton() {

  return (
    <div className="animate-pulse mt-6">
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {Array.from({ length: 5 }).map((header, index) => (
              <th key={index} className="border px-4 py-2">
                <div className="h-8 bg-gray-200 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 20 }).map((_, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">
                <div className="h-8 bg-gray-200 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}