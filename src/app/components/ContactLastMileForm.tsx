import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { trackEvent } from "@/app/lib/analytics";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  company: string;
  roleResponsibility: string;
  improvement: string;
  operationalEnvironment: string;
  systemsInvolved: string;
  supportingContext: string;
}

const environmentOptions = [
  "Mission-critical facilities / data centers",
  "Manufacturing / industrial operations",
  "Utilities / infrastructure",
  "Distributed facilities portfolio",
  "Fleet / robotics / mobile assets",
  "Other",
];

function buildMessage(data: FormData) {
  return [
    `Role or responsibility: ${data.roleResponsibility}`,
    `Operational environment: ${data.operationalEnvironment || "Not provided"}`,
    "",
    "What they are working to improve:",
    data.improvement,
    "",
    "Systems involved:",
    data.systemsInvolved || "Not provided",
    "",
    "Additional context or link:",
    data.supportingContext || "Not provided",
  ].join("\n");
}

export function ContactLastMileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (isSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSuccess]);

  const markStarted = () => {
    if (hasStarted) return;
    setHasStarted(true);
    trackEvent("form_contact_start", { form_name: "contact_last_mile" });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setIsError(false);

    try {
      const response = await fetch(
        "https://api.hsforms.com/submissions/v3/integration/submit/245388543/df5ed043-2fec-4e13-ae18-e1d17257e1da",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { name: "firstname", value: data.firstname },
              { name: "lastname", value: data.lastname },
              { name: "email", value: data.email },
              { name: "company", value: data.company },
              { name: "hs_role", value: data.roleResponsibility },
              { name: "message", value: buildMessage(data) },
            ],
            context: {
              pageUri: "https://lastmileinc.ai/contact",
              pageName: "Contact Last Mile",
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HubSpot submission failed with ${response.status}`);
      }

      trackEvent("form_contact_submit", {
        form_name: "contact_last_mile",
        operational_environment: data.operationalEnvironment,
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Contact form submission failed", error);
      setIsSubmitting(false);
      setIsError(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white">Thank you.</h3>
        <p className="mt-3 text-slate-300">
          A Last Mile team member will review what you shared and respond with the most appropriate next step.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocusCapture={markStarted} className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white">Contact Last Mile</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="firstname" className="text-white">First name *</Label>
          <Input id="firstname" {...register("firstname", { required: "First name is required" })} className="mt-2 min-h-11 border-slate-700 bg-slate-900/70 text-white" />
          {errors.firstname ? <p className="mt-1 text-sm text-red-400">{errors.firstname.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="lastname" className="text-white">Last name *</Label>
          <Input id="lastname" {...register("lastname", { required: "Last name is required" })} className="mt-2 min-h-11 border-slate-700 bg-slate-900/70 text-white" />
          {errors.lastname ? <p className="mt-1 text-sm text-red-400">{errors.lastname.message}</p> : null}
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-white">Work email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Work email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Enter a valid email address",
            },
          })}
          className="mt-2 min-h-11 border-slate-700 bg-slate-900/70 text-white"
        />
        {errors.email ? <p className="mt-1 text-sm text-red-400">{errors.email.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="company" className="text-white">Company *</Label>
        <Input id="company" {...register("company", { required: "Company is required" })} className="mt-2 min-h-11 border-slate-700 bg-slate-900/70 text-white" />
        {errors.company ? <p className="mt-1 text-sm text-red-400">{errors.company.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="roleResponsibility" className="text-white">Role or responsibility *</Label>
        <Input id="roleResponsibility" {...register("roleResponsibility", { required: "Role or responsibility is required" })} className="mt-2 min-h-11 border-slate-700 bg-slate-900/70 text-white" />
        {errors.roleResponsibility ? <p className="mt-1 text-sm text-red-400">{errors.roleResponsibility.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="improvement" className="text-white">What are you working to improve? *</Label>
        <textarea id="improvement" {...register("improvement", { required: "This field is required" })} className="mt-2 min-h-[140px] w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white" />
        {errors.improvement ? <p className="mt-1 text-sm text-red-400">{errors.improvement.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="operationalEnvironment" className="text-white">Operational environment</Label>
        <select id="operationalEnvironment" {...register("operationalEnvironment")} className="mt-2 min-h-11 w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white">
          <option value="" className="bg-slate-950">Select an environment</option>
          {environmentOptions.map((option) => (
            <option key={option} value={option} className="bg-slate-950">{option}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="systemsInvolved" className="text-white">Systems involved</Label>
        <textarea id="systemsInvolved" {...register("systemsInvolved")} className="mt-2 min-h-[110px] w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white" />
      </div>

      <div>
        <Label htmlFor="supportingContext" className="text-white">Additional context or link</Label>
        <textarea id="supportingContext" {...register("supportingContext")} className="mt-2 min-h-[110px] w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white" />
      </div>

      <p className="text-sm leading-6 text-slate-400">
        Please do not include credentials, proprietary source data, regulated personal information, or sensitive facility details.
      </p>

      {isError ? (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again or email <a href="mailto:contact@lastmileinc.ai" className="underline">contact@lastmileinc.ai</a>.
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="min-h-11 w-full bg-[#217ED9] text-white hover:bg-[#1a6bb8]">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Contact Last Mile"
        )}
      </Button>
    </form>
  );
}
