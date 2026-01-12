import { useState } from "react";

export default function FindById({
  label = "Find Record",
  placeholder = "Enter ID",
  onSearch,
  onFound,
}) {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch() {
    if (!id) {
      setError("ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await onSearch(id);
      onFound(result);
    } catch {
      setError("Record not found");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-4 rounded mb-6">
      <h2 className="font-semibold text-[#4400A5] mb-2">{label}</h2>

      <div className="flex gap-2">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder={placeholder}
          className="border p-2 flex-1"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-[#4400A5] text-white px-4 disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}
