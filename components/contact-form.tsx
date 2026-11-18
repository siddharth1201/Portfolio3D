"use client";

import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { Loader2, Send } from "lucide-react";

// Same working credentials as the 2D portfolio.
// Public key + service ID are safe to expose (they're NEXT_PUBLIC_ by design
// and EmailJS requires them client-side; spam protection lives in the dashboard).
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "service_c18yxai";
const EMAILJS_TEMPLATE_ID = "template_5vcx7u5";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

type Fields = { name: string; email: string; message: string };
const EMPTY: Fields = { name: "", email: "", message: "" };

// Minimal client-side validation — same rules as the old zod schema
function validate(values: Fields) {
  const errors: Partial<Fields> = {};
  if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Please enter a valid email address.";
  if (values.message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
  return errors;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#22d3ee]/50 focus:bg-white/[0.07]";

export function ContactForm() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(field: keyof Fields) {
    return (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [field]: e.currentTarget.value };
      setValues(next);
      // Clear a field's error as soon as the user fixes it
      if (errors[field]) setErrors(validate(next));
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    try {
      // Keys must match the variables in the EmailJS template
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: values.name,
          email: values.email,
          message: values.message,
          time: new Date().toLocaleString(),
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setStatus("sent");
      setValues(EMPTY);
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            className={inputClass}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-400/80">{errors.name}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={values.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            className={inputClass}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-400/80">{errors.email}</p>}
        </div>
      </div>

      <div>
        <textarea
          placeholder="Your message..."
          rows={5}
          value={values.message}
          onChange={set("message")}
          aria-invalid={!!errors.message}
          className={`${inputClass} resize-none`}
        />
        {errors.message && <p className="mt-1.5 text-xs text-red-400/80">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] px-8 py-4 font-medium text-[#05060a] shadow-lg shadow-[#22d3ee]/20 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Message
          </>
        )}
      </button>

      {status === "sent" && (
        <p className="text-sm text-[#7fe7f7]">Message sent — thank you for reaching out. I&apos;ll get back to you soon.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400/90">Something went wrong. Please try again or email me directly.</p>
      )}
    </form>
  );
}
