import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form data:", data);
    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after showing success message
    setTimeout(() => {
      setIsSuccess(false);
      reset();
    }, 5000);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-[#10b981]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-[#10b981] w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Message Received</h3>
        <p className="text-slate-400 mb-8">
          Our intelligence team will reach out to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="text-[#217ED9] font-semibold hover:text-[#75ADE6] transition-colors"
        >
          Send another message
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
          placeholder="Tell us about your project"
        />
        {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#217ED9] hover:bg-[#1a6bb8] text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}