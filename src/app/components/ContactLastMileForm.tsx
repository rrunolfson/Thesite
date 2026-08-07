import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router";
import { trackEvent } from "@/app/lib/analytics";

interface FormData { firstname: string; lastname: string; email: string; company: string; roleResponsibility: string; industry: string; intent: string; operatingIssue: string; systemsInvolved: string; recoveryMeasurement: string; businessConsequence: string; }
const intents = [
  ["operation", "Discuss a physical operations use case"], ["data-center-cooling", "Explore Data Center Cooling"], ["design-partnership", "Explore a design partnership"], ["partner", "Discuss an ecosystem relationship"], ["architecture", "Technical or architecture inquiry"], ["media", "Media or Signal 2 Action inquiry"],
] as const;
const industries = ["Data centers / mission-critical facilities", "Manufacturing", "Water / wastewater", "Cold storage / food operations", "Utilities / infrastructure", "Distributed facilities", "Other"];

function buildMessage(data: FormData) { return [`Type of conversation: ${data.intent}`, `Role: ${data.roleResponsibility}`, `Industry: ${data.industry}`, "", "Operating issue:", data.operatingIssue, "", "Systems involved:", data.systemsInvolved, "", "Measurement that would prove recovery:", data.recoveryMeasurement, "", "Business consequence:", data.businessConsequence].join("\n"); }

export function ContactLastMileForm() {
  const [params] = useSearchParams();
  const requested = params.get("intent") ?? "operation";
  const initialIntent = intents.some(([value]) => value === requested) ? requested : "operation";
  const [submitting, setSubmitting] = useState(false); const [success, setSuccess] = useState(false); const [failed, setFailed] = useState(false); const [started, setStarted] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({ defaultValues: { intent: initialIntent } });
  useEffect(() => { setValue("intent", initialIntent); }, [initialIntent, setValue]);
  useEffect(() => { if (success) window.scrollTo({ top: 0, behavior: "smooth" }); }, [success]);
  const start = () => { if (!started) { setStarted(true); trackEvent("form_contact_start", { form_name: "contact_last_mile", intent: initialIntent }); } };
  const onSubmit = async (data: FormData) => { setSubmitting(true); setFailed(false); try {
    if (import.meta.env.PROD) {
      const response = await fetch("https://api.hsforms.com/submissions/v3/integration/submit/245388543/df5ed043-2fec-4e13-ae18-e1d17257e1da", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: [{ name: "firstname", value: data.firstname }, { name: "lastname", value: data.lastname }, { name: "email", value: data.email }, { name: "company", value: data.company }, { name: "hs_role", value: data.roleResponsibility }, { name: "message", value: buildMessage(data) }], context: { pageUri: "https://lastmileinc.ai/contact", pageName: "Discuss Your Operation" } }) });
      if (!response.ok) throw new Error(`HubSpot submission failed with ${response.status}`);
    }
    trackEvent("form_contact_submit", { form_name: "contact_last_mile", intent: data.intent, review_mode: !import.meta.env.PROD }); setSuccess(true); reset();
  } catch (error) { console.error("Contact form submission failed", error); setFailed(true); } finally { setSubmitting(false); } };
  if (success) return <div className="lm-form-success"><CheckCircle2 /><h2>Thank you.</h2><p>We will review the Condition and response context you shared. A Last Mile team member will follow up within two business days with the most relevant next step.</p>{!import.meta.env.PROD ? <small>Review mode: no CRM record was created.</small> : null}</div>;
  return <form className="lm-form" onSubmit={handleSubmit(onSubmit)} onFocusCapture={start}><div><p className="lm-eyebrow">Operational conversation</p><h2>Describe one response.</h2></div>
    <div className="lm-form__two"><Field label="First name" error={errors.firstname?.message}><input {...register("firstname", { required: "First name is required" })} /></Field><Field label="Last name" error={errors.lastname?.message}><input {...register("lastname", { required: "Last name is required" })} /></Field></div>
    <Field label="Work email" error={errors.email?.message}><input type="email" {...register("email", { required: "Work email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Enter a valid email address" } })} /></Field>
    <div className="lm-form__two"><Field label="Organization" error={errors.company?.message}><input {...register("company", { required: "Organization is required" })} /></Field><Field label="Role" error={errors.roleResponsibility?.message}><input {...register("roleResponsibility", { required: "Role is required" })} /></Field></div>
    <div className="lm-form__two"><Field label="Industry" error={errors.industry?.message}><select {...register("industry", { required: "Industry is required" })}><option value="">Select an industry</option>{industries.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Type of conversation"><select {...register("intent", { onChange: (event) => trackEvent("form_conversation_type_selected", { intent: event.target.value }) })}>{intents.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field></div>
    <Field label="Describe one operating issue" error={errors.operatingIssue?.message}><textarea rows={4} placeholder="What changes, and where does the response become disconnected?" {...register("operatingIssue", { required: "Describe one operating issue" })} /></Field>
    <Field label="Which systems hold the signal, asset context, work, approvals, or provider communication?" error={errors.systemsInvolved?.message}><textarea rows={3} {...register("systemsInvolved", { required: "List the systems involved" })} /></Field>
    <Field label="What measurement would prove the operation recovered?" error={errors.recoveryMeasurement?.message}><textarea rows={3} {...register("recoveryMeasurement", { required: "Describe the recovery measurement" })} /></Field>
    <Field label="What is the business consequence when the response fails or takes too long?" error={errors.businessConsequence?.message}><textarea rows={3} {...register("businessConsequence", { required: "Describe the business consequence" })} /></Field>
    <p className="lm-form__warning">Do not submit credentials, proprietary source data, regulated personal information, or sensitive facility details. By submitting, you agree to our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>.</p>
    {failed ? <p className="lm-form__error">Submission failed. Try again or email <a href="mailto:contact@lastmileinc.ai">contact@lastmileinc.ai</a>.</p> : null}
    <button className="lm-form__submit" type="submit" disabled={submitting}>{submitting ? <><Loader2 className="animate-spin" />Sending…</> : "Discuss Your Operation"}</button>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="lm-field"><span>{label}</span>{children}{error ? <small>{error}</small> : null}</label>; }
