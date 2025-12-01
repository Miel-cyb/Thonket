'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [reports, setReports] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !description) return;

    const newReport = {
      id: Date.now(),
      category,
      description,
      fileName: file ? file.name : null,
      date: new Date().toLocaleString(),
    };

    setReports([newReport, ...reports]);
    setCategory('');
    setDescription('');
    setFile(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Support: Report Damages & Stockouts
      </h2>

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

      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Previous Reports
      </h3>
      <div className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports submitted yet.</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="shadow-sm rounded-xl bg-white">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{report.date}</p>
                    <p className="font-medium text-gray-800">
                      {report.category}
                    </p>
                    <p className="text-gray-600">{report.description}</p>
                    {report.fileName && (
                      <p className="text-xs text-blue-600 mt-1">
                        📎 {report.fileName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
