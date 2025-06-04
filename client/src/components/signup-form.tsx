import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Check } from "lucide-react";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  userType: z.enum(["solo", "accountant"], {
    required_error: "Please select how you'll use FinMatch",
  }),
  monthlyExpenses: z.enum(["under-500", "500-2000", "2000-5000", "over-5000"], {
    required_error: "Please select your monthly expense range",
  }),
  currentTool: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type SignupForm = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onClose: () => void;
}

export function SignupForm({ onClose }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      currentTool: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignupForm) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Free trial signup:", data);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Welcome to FinMatch!</CardTitle>
            <CardDescription className="text-gray-600">
              Thank you for signing up for the free trial. We'll send setup instructions to your email within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary-dark text-white"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <CardTitle className="text-2xl text-gray-900">Start Your Free Trial</CardTitle>
          <CardDescription className="text-gray-600">
            Get 30 days of FinMatch Service to see how AI-powered bookkeeping can transform your expense tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  className={form.formState.errors.firstName ? "border-red-500" : ""}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  className={form.formState.errors.lastName ? "border-red-500" : ""}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500" : ""}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                {...form.register("company")}
              />
            </div>

            <div className="space-y-2">
              <Label>How will you use FinMatch?</Label>
              <Select onValueChange={(value) => form.setValue("userType", value as "solo" | "accountant")}>
                <SelectTrigger className={form.formState.errors.userType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your use case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo Mode - Personal/Freelance Expenses</SelectItem>
                  <SelectItem value="accountant">Accountant Mode - Multiple Clients</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.userType && (
                <p className="text-sm text-red-600">{form.formState.errors.userType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Monthly expense volume</Label>
              <Select onValueChange={(value) => form.setValue("monthlyExpenses", value as any)}>
                <SelectTrigger className={form.formState.errors.monthlyExpenses ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select expense range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-500">Under $500</SelectItem>
                  <SelectItem value="500-2000">$500 - $2,000</SelectItem>
                  <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                  <SelectItem value="over-5000">Over $5,000</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.monthlyExpenses && (
                <p className="text-sm text-red-600">{form.formState.errors.monthlyExpenses.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentTool">Current expense tracking method (Optional)</Label>
              <Input
                id="currentTool"
                placeholder="e.g., Excel, QuickBooks, pen & paper"
                {...form.register("currentTool")}
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={form.watch("agreeToTerms")}
                onCheckedChange={(checked) => form.setValue("agreeToTerms", checked as boolean)}
                className={form.formState.errors.agreeToTerms ? "border-red-500" : ""}
              />
              <div className="space-y-1">
                <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
                {form.formState.errors.agreeToTerms && (
                  <p className="text-sm text-red-600">{form.formState.errors.agreeToTerms.message}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">What's included in your free trial:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ 30 days full access to FinMatch Service</li>
                <li>✓ Email receipt extraction (Gmail & Outlook)</li>
                <li>✓ Bank transaction sync via Plaid</li>
                <li>✓ AI-powered receipt matching</li>
                <li>✓ Tax-ready categorization</li>
                <li>✓ Export to CSV or TurboTax format</li>
                <li>✓ Email support during trial</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold"
            >
              {isSubmitting ? "Starting Your Trial..." : "Start Free Trial"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}