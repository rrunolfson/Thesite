import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, CheckCircle2, Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import emailjs from "@emailjs/browser";

// EmailJS Configuration
// To enable email functionality, sign up at https://www.emailjs.com/
// and replace these placeholder values with your actual credentials:
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // e.g., "service_abc123"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // e.g., "template_xyz789"
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // e.g., "user_123456789"
// Set the recipient email in your EmailJS template to: partners@lastmileinc.ai

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  apiDocsUrl: string;
}

export function OEMForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert file to base64 if present
      let fileData = null;
      if (uploadedFile) {
        const reader = new FileReader();
        fileData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(uploadedFile);
        });
      }

      // Prepare email parameters
      const emailParams = {
        to_email: "partners@lastmileinc.ai",
        from_name: data.name,
        from_email: data.email,
        company: data.company,
        role: data.role,
        message: data.message,
        api_docs_url: data.apiDocsUrl || "Not provided",
        file_name: uploadedFile ? uploadedFile.name : "No file attached",
        file_data: fileData || "No file attached",
      };

      // Send email using EmailJS
      // NOTE: Replace the placeholder credentials above with real EmailJS credentials
      // For now, this will log the data and simulate a successful submission
      if (
        EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
        EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
        EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"
      ) {
        // Demo mode - just log and show success
        console.log("=== OEM Portal Form Submission (Demo Mode) ===");
        console.log("Email would be sent to: partners@lastmileinc.ai");
        console.log("Form Data:", emailParams);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        // Production mode - actually send email
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailParams,
          EMAILJS_PUBLIC_KEY
        );
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset after showing success message
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        setUploadedFile(null);
      }, 5000);
    } catch (err) {
      console.error("Error sending email:", err);
      setError(
        "Failed to send your submission. Please try again or contact us directly at partners@lastmileinc.ai"
      );
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-[#10b981]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-[#10b981] w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Technical Data Received</h3>
        <p className="text-slate-400 mb-8">
          Our technical team will review your submission and reach out within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="text-[#217ED9] font-semibold hover:text-[#75ADE6] transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-white">
          Name *
        </Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
          className="mt-2 bg-slate-800/50 border-slate-700 text-white"
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="text-white">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="mt-2 bg-slate-800/50 border-slate-700 text-white"
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="company" className="text-white">
          Company *
        </Label>
        <Input
          id="company"
          {...register("company", { required: "Company is required" })}
          className="mt-2 bg-slate-800/50 border-slate-700 text-white"
          placeholder="Your company"
        />
        {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>}
      </div>

      <div>
        <Label htmlFor="role" className="text-white">
          Role *
        </Label>
        <Input
          id="role"
          {...register("role", { required: "Role is required" })}
          className="mt-2 bg-slate-800/50 border-slate-700 text-white"
          placeholder="Your role"
        />
        {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>}
      </div>

      <div>
        <Label htmlFor="message" className="text-white">
          Message *
        </Label>
        <textarea
          id="message"
          {...register("message", { required: "Message is required" })}
          className="mt-2 w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#217ED9] min-h-[120px]"
          placeholder="Tell us about your technology and partnership interest"
        />
        {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
      </div>

      <div>
        <Label htmlFor="openapi-files" className="text-white">
          OpenAPI/YML Files
        </Label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-2 border-2 border-dashed rounded-md p-8 text-center transition-colors ${
            isDragging
              ? "border-[#217ED9] bg-[#217ED9]/10"
              : "border-slate-700 bg-slate-800/50"
          }`}
        >
          <input
            type="file"
            id="openapi-files"
            onChange={handleFileChange}
            className="hidden"
            accept=".yml,.yaml,.json"
          />
          {uploadedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-[#217ED9]" />
              <div className="text-left">
                <p className="text-white font-medium">{uploadedFile.name}</p>
                <p className="text-slate-400 text-sm">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="ml-4 text-slate-400 hover:text-white"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-300 mb-2">Drag and drop your file here, or</p>
              <label
                htmlFor="openapi-files"
                className="text-[#217ED9] hover:text-[#75ADE6] font-semibold cursor-pointer"
              >
                browse to upload
              </label>
              <p className="text-slate-500 text-sm mt-2">Accepts .yml, .yaml, or .json files</p>
            </>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="apiDocsUrl" className="text-white">
          API Docs URL
        </Label>
        <Input
          id="apiDocsUrl"
          type="url"
          {...register("apiDocsUrl")}
          className="mt-2 bg-slate-800/50 border-slate-700 text-white"
          placeholder="https://api.yourcompany.com/docs"
        />
        {errors.apiDocsUrl && (
          <p className="text-red-400 text-sm mt-1">{errors.apiDocsUrl.message}</p>
        )}
      </div>

      {error && (
        <div className="text-red-400 text-sm mt-1">
          <AlertCircle className="inline-block w-4 h-4 mr-1" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#217ED9] hover:bg-[#1a6bb8] text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          "Submit Technical Data"
        )}
      </Button>
    </form>
  );
}