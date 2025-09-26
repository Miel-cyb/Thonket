"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function SupportPage() {
  const [reports, setReports] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
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
    setCategory("");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-10">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Support: Report Damages & Stockouts
      </h2>

      {/* Report Form */}
      <Card className="mb-8 shadow-md rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Issue Type
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Damage">Damage</SelectItem>
                  <SelectItem value="Stockout">Stockout</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Description
              </label>
              <Textarea
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Attach File (Optional)
              </label>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Submit Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Report History */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Previous Reports
      </h3>
      <div className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports submitted yet.</p>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="shadow-sm rounded-xl">
              <CardContent className="p-4">
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
