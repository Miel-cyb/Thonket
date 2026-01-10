'use client';

import { useState, useEffect } from 'react';

export default function SupportPage({ onReportSubmit }) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !description) return;

    if (window.confirm("Are you sure you want to submit this report?")) {
      const newReport = {
        id: Date.now(),
        category,
        description,
        fileName: file ? file.name : null,
        date: new Date().toISOString(),
        title: `${category}: ${description.substring(0, 30)}...`
      };

      onReportSubmit(newReport);
      setCategory('');
      setDescription('');
      setFile(null);
      setShowSuccess(true);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Support: Report Damages & Stockouts
      </h2>

      {showSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <p>Report submitted successfully!</p>
        </div>
      )}

      <div className="mb-8 shadow-md rounded-2xl bg-white">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Issue Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>Select issue type</option>
                <option value="Damage">Damage</option>
                <option value="Stockout">Stockout</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Attach File (Optional)
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
