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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Check, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

const subscriptionSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().optional(),
  userType: z.enum(["solo", "accountant"], {
    required_error: "Please select how you'll use FlowBooks Associate",
  }),
  planType: z.enum(["monthly", "annual"], {
    required_error: "Please select a billing period",
  }),
  clientCount: z.string().optional(),
  phoneNumber: z.string().optional(),
  referralSource: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  marketingEmails: z.boolean().default(false),
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  onClose: () => void;
}

export function SubscriptionForm({ onClose }: SubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      company: "",
      phoneNumber: "",
      referralSource: "",
      clientCount: "",
      agreeToTerms: false,
      marketingEmails: false,
      planType: "monthly",
    },
  });

  const watchedUserType = form.watch("userType");
  const watchedPlanType = form.watch("planType");

  const getPricing = () => {
    if (watchedUserType === "solo") {
      return {
        monthly: { price: "$29", savings: "" },
        annual: { price: "$290", savings: "Save $58/year" },
      };
    } else {
      return {
        monthly: { price: "$89", savings: "" },
        annual: { price: "$890", savings: "Save $178/year" },
      };
    }
  };

  const onSubmit = async (data: SubscriptionForm) => {
    setIsSubmitting(true);
    
    try {
      if (supabase) {
        // Use Supabase if configured
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create user profile with subscription data
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{
              id: authData.user.id,
              email: data.email,
              first_name: data.firstName,
              last_name: data.lastName,
              company: data.company || null,
              user_type: data.userType,
              plan_type: data.planType,
              client_count: data.clientCount || null,
              phone_number: data.phoneNumber || null,
              referral_source: data.referralSource || null,
              marketing_emails: data.marketingEmails
            }]);

          if (profileError) throw profileError;
        }
      } else {
        // Fall back to existing API endpoint
        const response = await fetch('/api/signup/subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Signup failed');
        }
      }

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Subscription signup error:", error);
      alert(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">You're on the waitlist!</CardTitle>
            <CardDescription className="text-gray-600">
              Thank you for your interest in FlowBooks Associate. We've sent a confirmation email with next steps and early access details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary-dark text-white"
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pricing = getPricing();

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
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-600">Early Access Program</span>
          </div>
          <CardTitle className="text-2xl text-gray-900">Join FlowBooks Associate</CardTitle>
          <CardDescription className="text-gray-600">
            Get priority access to our AI-powered bookkeeping service with exclusive early adopter pricing.
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
              <Label htmlFor="email">Business Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                className={form.formState.errors.password ? "border-red-500" : ""}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company/Business Name</Label>
                <Input
                  id="company"
                  {...form.register("company")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...form.register("phoneNumber")}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Select your use case</Label>
              <RadioGroup 
                value={form.watch("userType")} 
                onValueChange={(value) => form.setValue("userType", value as "solo" | "accountant")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="solo" id="solo" />
                  <Label htmlFor="solo" className="flex-1 cursor-pointer">
                    <div className="font-medium">Solo Mode</div>
                    <div className="text-sm text-gray-600">Personal finances, freelancing, consulting</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="accountant" id="accountant" />
                  <Label htmlFor="accountant" className="flex-1 cursor-pointer">
                    <div className="font-medium">Accountant Mode</div>
                    <div className="text-sm text-gray-600">Managing multiple clients, bookkeeping business</div>
                  </Label>
                </div>
              </RadioGroup>
              {form.formState.errors.userType && (
                <p className="text-sm text-red-600">{form.formState.errors.userType.message}</p>
              )}
            </div>

            {watchedUserType === "accountant" && (
              <div className="space-y-2">
                <Label htmlFor="clientCount">How many clients do you manage?</Label>
                <Select onValueChange={(value) => form.setValue("clientCount", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 clients</SelectItem>
                    <SelectItem value="6-15">6-15 clients</SelectItem>
                    <SelectItem value="16-30">16-30 clients</SelectItem>
                    <SelectItem value="30+">30+ clients</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-3">
              <Label>Billing preference</Label>
              <RadioGroup 
                value={form.watch("planType")} 
                onValueChange={(value) => form.setValue("planType", value as "monthly" | "annual")}
                className="space-y-3"
              >
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">
                      <div className="font-medium">Monthly</div>
                      <div className="text-sm text-gray-600">{pricing.monthly.price}/month</div>
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="annual" id="annual" />
                    <Label htmlFor="annual" className="cursor-pointer">
                      <div className="font-medium">Annual</div>
                      <div className="text-sm text-gray-600">{pricing.annual.price}/year</div>
                    </Label>
                  </div>
                  {pricing.annual.savings && (
                    <span className="text-sm font-medium text-green-600">{pricing.annual.savings}</span>
                  )}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralSource">How did you hear about us? (Optional)</Label>
              <Select onValueChange={(value) => form.setValue("referralSource", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google search</SelectItem>
                  <SelectItem value="social">Social media</SelectItem>
                  <SelectItem value="referral">Friend/colleague referral</SelectItem>
                  <SelectItem value="blog">Blog/article</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
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

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketingEmails"
                  checked={form.watch("marketingEmails")}
                  onCheckedChange={(checked) => form.setValue("marketingEmails", checked as boolean)}
                />
                <Label htmlFor="marketingEmails" className="text-sm leading-relaxed">
                  I'd like to receive product updates and bookkeeping tips via email
                </Label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Early Access Benefits:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ 50% off regular pricing for first 6 months</li>
                <li>✓ Priority customer support</li>
                <li>✓ Direct feedback line to our product team</li>
                <li>✓ Exclusive webinars and training sessions</li>
                <li>✓ Advanced features before general release</li>
                <li>✓ Free migration assistance from current tools</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold"
            >
              {isSubmitting ? "Joining Waitlist..." : "Join Early Access Program"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}