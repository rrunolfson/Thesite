import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
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
  conversationType: string;
  operationalEnvironment: string;
  responseGap: string;
  existingSystems: string;
  desiredOutcome: string;
  supportingContext: string;
}

const conversationOptions = [
  { value: "design-partner-conversation", label: "Design-partner conversation" },
  { value: "technical-collaboration", label: "Technical collaboration" },
  { value: "source-profile-discussion", label: "Source-profile discussion" },
  { value: "ssom-discussion", label: "SSOM discussion" },
  { value: "podcast", label: "Signal 2 Action guest proposal" },
  { value: "other", label: "Other" },
];

const environmentOptions = [
  "Mission-critical facilities / data centers",
  "Manufacturing / industrial operations",
  "Utilities / infrastructure",
  "Distributed facilities portfolio",
  "Fleet / robotics / mobile assets",
  "Other",
];

function getConversationTypeFromQuery(value: string | null) {
  if (!value) {
    return "design-partner-conversation";
  }

  const normalizedValue = value.toLowerCase();

  if (normalizedValue === "technical-collaboration") {
    return "technical-collaboration";
  }

  if (normalizedValue === "podcast") {
    return "podcast";
  }

  if (normalizedValue === "source-profile-discussion") {
    return "source-profile-discussion";
  }

  if (normalizedValue === "ssom-discussion") {
    return "ssom-discussion";
  }

  return "design-partner-conversation";
}

function buildMessage(data: FormData) {
  return [
    `Conversation type: ${data.conversationType}`,
    `Operational environment: ${data.operationalEnvironment}`,
    `Role or responsibility: ${data.roleResponsibility}`,
    "",
    "Operational signal or response gap:",
    data.responseGap,
    "",
    "Existing systems involved:",
    data.existingSystems || "Not provided",
    "",
    "Desired outcome from the conversation:",
    data.desiredOutcome,
    "",
    "Optional supporting context or link:",
    data.supportingContext || "Not provided",
  ].join("\n");
}

export function DesignPartnerForm() {
  const [searchParams] = useSearchParams();
  const initialConversationType = useMemo(
    () => getConversationTypeFromQuery(searchParams.get("conversation_type")),
    [searchParams],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      conversationType: initialConversationType,
    },
  });

  useEffect(() => {
    setValue("conversationType", initialConversationType);
  }, [initialConversationType, setValue]);

  const markStarted = () => {
    if (hasStarted) {
      return;
    }

    setHasStarted(true);
    trackEvent("form_design_partner_start", {
      conversation_type: initialConversationType,
    });
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
              pageUri: "https://lastmileinc.ai/design-partner",
              pageName: "Design Partner",
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HubSpot submission failed with ${response.status}`);
      }

      trackEvent("form_design_partner_submit", {
        conversation_type: data.conversationType,
        operational_environment: data.operationalEnvironment,
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      reset({
        conversationType: initialConversationType,
      });
    } catch (error) {
      console.error("Design partner submission failed", error);
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
          A Last Mile team member will review the operational context you shared and respond with the most appropriate next step. We are interested in grounded conversations about real work, not form-fill theater.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocusCapture={markStarted} className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white">Start the conversation</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="firstname" className="text-white">First name *</Label>
          <Input
            id="firstname"
            {...register("firstname", { required: "First name is required" })}
            className="mt-2 border-slate-700 bg-slate-900/70 text-white"
          />
          {errors.firstname ? <p className="mt-1 text-sm text-red-400">{errors.firstname.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="lastname" className="text-white">Last name *</Label>
          <Input
            id="lastname"
            {...register("lastname", { required: "Last name is required" })}
            className="mt-2 border-slate-700 bg-slate-900/70 text-white"
          />
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
          className="mt-2 border-slate-700 bg-slate-900/70 text-white"
        />
        {errors.email ? <p className="mt-1 text-sm text-red-400">{errors.email.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="company" className="text-white">Company *</Label>
        <Input
          id="company"
          {...register("company", { required: "Company is required" })}
          className="mt-2 border-slate-700 bg-slate-900/70 text-white"
        />
        {errors.company ? <p className="mt-1 text-sm text-red-400">{errors.company.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="roleResponsibility" className="text-white">Role or responsibility *</Label>
        <Input
          id="roleResponsibility"
          {...register("roleResponsibility", { required: "Role or responsibility is required" })}
          className="mt-2 border-slate-700 bg-slate-900/70 text-white"
        />
        {errors.roleResponsibility ? <p className="mt-1 text-sm text-red-400">{errors.roleResponsibility.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="conversationType" className="text-white">Conversation type *</Label>
        <select
          id="conversationType"
          {...register("conversationType", {
            required: "Conversation type is required",
            onChange: (event) => {
              trackEvent("form_conversation_type_selected", {
                conversation_type: event.target.value,
              });
            },
          })}
          className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white"
        >
          {conversationOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-950">
              {option.label}
            </option>
          ))}
        </select>
        {errors.conversationType ? <p className="mt-1 text-sm text-red-400">{errors.conversationType.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="operationalEnvironment" className="text-white">Operational environment *</Label>
        <select
          id="operationalEnvironment"
          {...register("operationalEnvironment", { required: "Operational environment is required" })}
          className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white"
        >
          <option value="" className="bg-slate-950">Select an environment</option>
          {environmentOptions.map((option) => (
            <option key={option} value={option} className="bg-slate-950">
              {option}
            </option>
          ))}
        </select>
        {errors.operationalEnvironment ? <p className="mt-1 text-sm text-red-400">{errors.operationalEnvironment.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="responseGap" className="text-white">What operational signal or response gap are you trying to improve? *</Label>
        <textarea
          id="responseGap"
          {...register("responseGap", { required: "This field is required" })}
          className="mt-2 min-h-[140px] w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white"
        />
        {errors.responseGap ? <p className="mt-1 text-sm text-red-400">{errors.responseGap.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="existingSystems" className="text-white">Existing systems involved, if known</Label>
        <textarea
          id="existingSystems"
          {...register("existingSystems")}
          className="mt-2 min-h-[110px] w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white"
        />
      </div>

      <div>
        <Label htmlFor="desiredOutcome" className="text-white">Desired outcome from the conversation *</Label>
        <textarea
          id="desiredOutcome"
          {...register("desiredOutcome", { required: "This field is required" })}
          className="mt-2 min-h-[120px] w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white"
        />
        {errors.desiredOutcome ? <p className="mt-1 text-sm text-red-400">{errors.desiredOutcome.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="supportingContext" className="text-white">Optional supporting context or link</Label>
        <textarea
          id="supportingContext"
          {...register("supportingContext")}
          className="mt-2 min-h-[110px] w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-white"
        />
      </div>

      <p className="text-sm leading-6 text-slate-400">
        Do not include confidential source data, credentials, regulated personal information, or sensitive facility details in this form. We will use the information you provide only to evaluate and respond to your request.
      </p>

      {isError ? (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again or email <a href="mailto:contact@lastmileinc.ai" className="underline">contact@lastmileinc.ai</a>.
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#217ED9] text-white hover:bg-[#1a6bb8]">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Request a design-partner conversation"
        )}
      </Button>
    </form>
  );
}