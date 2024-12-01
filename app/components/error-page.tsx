export function ErrorPage({ error }: { error: unknown }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Failed to load data</h1>
        <p className="text-gray-500">
          An error occurred while loading the data
        </p>
        {error instanceof Error && (
          <p className="text-gray-500">{error.message}</p>
        )}
      </div>
    </div>
  );
}
