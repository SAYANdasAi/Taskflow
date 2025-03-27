"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileUp, X, FileText, Image, File, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface EnhancedFileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // in MB
}

export function EnhancedFileUpload({
  onFileSelect,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 10,
}: EnhancedFileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        toast.error(`File too large`, {
          description: `Maximum file size is ${maxSize}MB`,
        })
        return
      }

      setFile(selectedFile)
      onFileSelect(selectedFile)

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setPreview(event.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }

      // Simulate upload progress
      simulateUpload()
    }
  }

  const simulateUpload = () => {
    setUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = () => {
    if (!file) return <FileUp className="h-10 w-10 text-muted-foreground" />

    if (file.type.includes("pdf")) {
      return <FileText className="h-10 w-10 text-red-500" />
    } else if (file.type.includes("image")) {
      return <Image className="h-10 w-10 text-blue-500" />
    } else {
      return <File className="h-10 w-10 text-green-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          file ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
      >
        {file && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 rounded-full bg-background/80 p-0"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        )}

        <input
          type="file"
          id="file-upload"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
        />

        <label
          htmlFor="file-upload"
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2"
        >
          {preview ? (
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            getFileIcon()
          )}

          <div className="text-center">
            {file ? (
              <>
                <p className="font-medium text-primary">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · Click or drag to replace
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">Drag & drop file here or click to browse</p>
                <p className="text-sm text-muted-foreground">Supports PDF, JPG, and PNG (max {maxSize}MB)</p>
              </>
            )}
          </div>
        </label>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing file...</span>
            </div>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  )
}

