"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ForgotPasswordPhoneStep } from "./forgot-password-phone-step";
import { ForgotPasswordOtpStep } from "./forgot-password-otp-step";
import { ForgotPasswordNewPasswordStep } from "./forgot-password-new-password-step";

export type ForgotPasswordStep = "phone" | "otp" | "password";

type ForgotPasswordFlowProps = {
  initialIdentifier?: string;
  onSuccess: (verifiedIdentifier: string) => void;
  onCancel: () => void;
};

export function ForgotPasswordFlow({
  initialIdentifier = "",
  onSuccess,
  onCancel,
}: ForgotPasswordFlowProps) {
  const [step, setStep] = useState<ForgotPasswordStep>("phone");
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [displayIdentifier, setDisplayIdentifier] = useState("");
  const [resetToken, setResetToken] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const handleCodeSent = (rawIdentifier: string, maskedContact?: string) => {
    setIdentifier(rawIdentifier);
    setDisplayIdentifier(maskedContact || rawIdentifier);
    setStep("otp");
  };

  const handleOtpVerified = (token: string) => {
    setResetToken(token);
    setStep("password");
  };

  const handlePasswordResetComplete = () => {
    onSuccess(identifier);
  };

  return (
    <div className="space-y-4">
      {/* Visual Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            step === "phone" ? "w-8 bg-accent" : "w-3 bg-muted-foreground/30"
          }`}
        />
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            step === "otp" ? "w-8 bg-accent" : "w-3 bg-muted-foreground/30"
          }`}
        />
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            step === "password" ? "w-8 bg-accent" : "w-3 bg-muted-foreground/30"
          }`}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === "phone" && (
          <motion.div
            key="forgot-phone-step"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            transition={{ duration: 0.25 }}
          >
            <ForgotPasswordPhoneStep
              initialIdentifier={identifier}
              onCodeSent={handleCodeSent}
              onBackToLogin={onCancel}
            />
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="forgot-otp-step"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            transition={{ duration: 0.25 }}
          >
            <ForgotPasswordOtpStep
              identifier={identifier}
              displayIdentifier={displayIdentifier}
              onVerified={handleOtpVerified}
              onChangeContact={() => setStep("phone")}
              onBackToLogin={onCancel}
            />
          </motion.div>
        )}

        {step === "password" && (
          <motion.div
            key="forgot-password-step"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            transition={{ duration: 0.25 }}
          >
            <ForgotPasswordNewPasswordStep
              resetToken={resetToken}
              onSuccess={handlePasswordResetComplete}
              onBackToLogin={onCancel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
