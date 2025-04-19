"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.status === 401) {
          // console.log("error is set?");
          setError('Unauthorized');
          return;
      }
      else if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setUrl(data.url);
      setError(null);
    } catch (err) {
      setError("Failed to upload file");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Upload to DigitalOcean Spaces</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border-0 file:bg-gray-100
                 file:text-sm file:font-semibold file:text-gray-700
                 hover:file:bg-gray-200 cursor-pointer"
        />
        <Button type="submit">Upload</Button>
      </form>
      {error && <p>{error}</p>}
      {url && !error && (
        <p>
          File uploaded:{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </p>
      )}
    </div>
  );
}