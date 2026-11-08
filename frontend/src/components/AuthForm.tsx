"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, FlaskConical, Info } from "lucide-react";
import styles from "@/styles/auth.module.css";

type Field = "name" | "email" | "institution" | "password" | "confirmPassword";
type Errors = Partial<Record<Field, string>>;

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notice, setNotice] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(data) as Record<Field, string>;
    const nextErrors: Errors = {};

    if (registering && !values.name?.trim()) nextErrors.name = "Enter your full name.";
    if (!values.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (registering && !values.institution?.trim()) nextErrors.institution = "Enter your university or institution.";
    if (!values.password) nextErrors.password = "Enter your password.";
    else if (registering && values.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (registering && !values.confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    else if (registering && values.password !== values.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";

    setErrors(nextErrors);
    setNotice("");
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      const input = form.elements.namedItem(firstInvalid);
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }

    // No account API is configured. Never persist credentials or simulate authentication.
    for (const name of ["password", "confirmPassword"]) {
      const input = form.elements.namedItem(name);
      if (input instanceof HTMLInputElement) input.value = "";
    }
    setShowPassword(false);
    setShowConfirmation(false);
    setNotice(registering
      ? "Account registration is not connected yet, so no account was created. You can still explore the demo workspace below."
      : "Account sign-in is not connected yet. You can explore the demo workspace below without signing in.");
  }

  function clearFeedback(event: React.FormEvent<HTMLFormElement>) {
    const input = event.target;
    if (input instanceof HTMLInputElement) {
      const name = input.name as Field;
      setErrors(previous => ({ ...previous, [name]: undefined, ...(name === "password" ? { confirmPassword: undefined } : {}) }));
      setNotice("");
    }
  }

  function feedback(field: Field) {
    return errors[field] ? <span id={`${mode}-${field}-error`} className={styles.fieldError}>{errors[field]}</span> : null;
  }

  return (
    <>
      <div className={styles.demoNotice}><Info size={16} /><p><strong>Frontend preview.</strong> Account sign-in is not connected yet. Use sample details to try the forms, or explore the demo below.</p></div>
      <form noValidate onSubmit={submit} onInput={clearFeedback} className={styles.form}>
        {registering && <div className={styles.field}>
          <label htmlFor="register-name">Full name</label>
          <input id="register-name" name="name" type="text" autoComplete="name" placeholder="Alex Morgan" maxLength={100} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "register-name-error" : undefined} />
          {feedback("name")}
        </div>}
        <div className={styles.field}>
          <label htmlFor={`${mode}-email`}>Email address</label>
          <input id={`${mode}-email`} name="email" type="email" autoComplete={registering ? "email" : "username"} placeholder="you@university.edu" maxLength={254} required spellCheck={false} autoCapitalize="none" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${mode}-email-error` : undefined} />
          {feedback("email")}
        </div>
        {registering && <div className={styles.field}>
          <label htmlFor="register-institution">University or institution</label>
          <input id="register-institution" name="institution" type="text" autoComplete="organization" placeholder="Your university" maxLength={160} required aria-invalid={!!errors.institution} aria-describedby={errors.institution ? "register-institution-error" : undefined} />
          {feedback("institution")}
        </div>}
        <div className={styles.field}>
          <label htmlFor={`${mode}-password`}>Password</label>
          <div className={styles.passwordInput}>
            <input id={`${mode}-password`} name="password" type={showPassword ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} placeholder={registering ? "Create a password" : "Enter your password"} required minLength={registering ? 8 : undefined} aria-invalid={!!errors.password} aria-describedby={errors.password ? `${mode}-password-error` : registering ? "register-password-hint" : undefined} />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-controls={`${mode}-password`} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {feedback("password")}
          {registering && <small id="register-password-hint">Use at least 8 characters.</small>}
        </div>
        {registering && <div className={styles.field}>
          <label htmlFor="register-confirmPassword">Confirm password</label>
          <div className={styles.passwordInput}>
            <input id="register-confirmPassword" name="confirmPassword" type={showConfirmation ? "text" : "password"} autoComplete="new-password" placeholder="Re-enter your password" required aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? "register-confirmPassword-error" : undefined} />
            <button type="button" aria-label={showConfirmation ? "Hide confirmation password" : "Show confirmation password"} aria-controls="register-confirmPassword" aria-pressed={showConfirmation} onClick={() => setShowConfirmation(value => !value)}>{showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {feedback("confirmPassword")}
        </div>}
        {Object.values(errors).some(Boolean) && <p role="alert" className={styles.errorSummary}>Please check the highlighted fields.</p>}
        {notice && <div role="status" className={styles.result}><Info size={17} /><p>{notice}</p></div>}
        <button type="submit" className={styles.submit}>{registering ? "Create account" : "Log in"}<ArrowRight size={17} /></button>
      </form>
      <div className={styles.divider}><span /> or explore first <span /></div>
      <Link href="/" className={styles.demoButton}><FlaskConical size={17} /> Continue with demo account <ArrowRight size={16} /></Link>
      <p className={styles.demoCaption}>A simulated workspace. No account or payment required.</p>
    </>
  );
}
