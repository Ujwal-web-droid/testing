import OnboardingWizard from "@/components/OnboardingWizard";

export const metadata = {
  title: "Onboarding — WebGuard AI",
  description: "Set up your role and target domain for automated security audits.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
