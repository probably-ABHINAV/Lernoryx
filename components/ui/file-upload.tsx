"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud, File, X, Loader2 } from "lucide-react";

interface FileUploadProps {
  sectionId: string;
  onSuccess?: (path: string) => void;
}

export function FileUpload({ sectionId, onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 1. Frontend validation check (Fast Fail)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File excessively large. Maximum payload size is 5MB.");
      return;
    }

    const safeTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!safeTypes.includes(selectedFile.type)) {
      toast.error("Invalid format. Please upload PNG, JPEG, or PDF documents.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Locate a file to upload first");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section_id", sectionId);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process payload.");
      }

      toast.success("File uploaded securely!");
      setFile(null); // Clear buffer

      if (onSuccess) {
        onSuccess(data.path);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 border-2 border-dashed border-slate-200 rounded-xl p-8 hover:bg-slate-50 transition-colors group relative">
      {!file ? (
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-6 w-6 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG or PDF (max. 5MB)</p>
          </div>
          {/* Invisible input overlaying the dropzone entirely visually */}
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-50 flex items-center justify-center rounded-md">
              <File className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-semibold text-slate-700 max-w-[200px] truncate">{file.name}</span>
               <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setFile(null)} disabled={isUploading}>
              <X className="h-4 w-4 text-slate-500 hover:text-rose-500" />
            </Button>
            <Button size="sm" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isUploading ? "Processing..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
