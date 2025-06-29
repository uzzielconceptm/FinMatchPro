import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  Clock, 
  AlertTriangle, 
  FileX, 
  Check, 
  Mail, 
  CreditCard, 
  Link, 
  Tag, 
  BarChart3, 
  Settings, 
  UserPlus, 
  Download,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";
import { SignupForm } from "@/components/signup-form";
import { SubscriptionForm } from "@/components/subscription-form";

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function FadeInSection({ children, className = "", delay = 0 }: FadeInSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 overflow-x-hidden">
      <Navigation onSubscriptionClick={() => setShowSubscriptionForm(true)} />

      {/* Hero Section */}
      <section className="relative section-spacing">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
                Track expenses, receipts, and bank transactions{" "}
                <span className="text-primary">— without the spreadsheets.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed font-medium max-w-2xl">
                A higher-quality AI-powered bookkeeping service for solopreneurs and accountants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => scrollToSection("how-it-works")}
                  className="border-2 border-primary hover:bg-primary hover:text-white text-primary px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  See how it works
                </Button>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern business dashboard" 
                className="rounded-lg card-shadow w-full" 
              />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Primary Pain Section */}
      <section className="section-spacing bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeInSection>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Why manual tracking <span className="text-red-600">doesn't scale</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium max-w-3xl mx-auto">
              Manual expense tracking wastes hours and leads to missed deductions or audit stress.
            </p>
          </FadeInSection>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <FadeInSection delay={0.1} className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Time Consuming</h3>
              <p className="text-gray-600">Hours spent sorting through receipts and categorizing expenses</p>
            </FadeInSection>
            <FadeInSection delay={0.2} className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Error Prone</h3>
              <p className="text-gray-600">Manual entry leads to mistakes and missed deductions</p>
            </FadeInSection>
            <FadeInSection delay={0.3} className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileX className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Audit Stress</h3>
              <p className="text-gray-600">Disorganized records create anxiety during tax season</p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Primary Benefit Section */}
      <section className="section-spacing bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Financial automation dashboard" 
                className="rounded-lg card-shadow w-full" 
              />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                How FlowBooks Associate <span className="text-primary">simplifies everything</span>
              </h2>
              <p className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed font-medium">
                FlowBooks Associate connects your inbox and bank — receipts are matched, categorized, and ready to export.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700">Automatic receipt extraction from email</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700">Smart matching with bank transactions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700">Tax-ready categorization and exports</span>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeInSection>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Key features built for <span className="text-primary">real workflows</span>
              </h2>
            </FadeInSection>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Mail, title: "Email-to-receipt extraction", subtitle: "Gmail & Outlook integration" },
              { icon: CreditCard, title: "Bank and card sync", subtitle: "Plaid integration" },
              { icon: Link, title: "Auto-matching receipts", subtitle: "to transactions" },
              { icon: Tag, title: "Smart tax tagging", subtitle: "per expense" },
              { icon: BarChart3, title: "Reconciliation dashboard", subtitle: "Clear overview" },
              { icon: Settings, title: "Custom rules", subtitle: "and tagging" },
              { icon: UserPlus, title: "Invite your accountant", subtitle: "Collaboration tools" },
              { icon: Download, title: "Export options", subtitle: "CSV or TurboTax-ready format" }
            ].map((feature, index) => (
              <FadeInSection key={index} delay={index * 0.1} className="bg-white rounded-xl p-8 card-shadow hover:card-shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-primary">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{feature.title}</h3>
                <p className="text-gray-600 font-medium">{feature.subtitle}</p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-spacing bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeInSection>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                How it <span className="text-primary">works</span>
              </h2>
            </FadeInSection>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect your email and bank",
                description: "Securely link your Gmail, Outlook, and bank accounts through our encrypted connections."
              },
              {
                step: "2", 
                title: "FlowBooks Associate finds and matches receipts",
                description: "Our AI automatically extracts receipts from your inbox and matches them to bank transactions."
              },
              {
                step: "3",
                title: "You get a clean, categorized record", 
                description: "Access your organized expenses with proper tax categories, ready for export or accountant review."
              }
            ].map((item, index) => (
              <FadeInSection key={index} delay={index * 0.2} className="text-center p-8 bg-white rounded-xl card-shadow hover:card-shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-3xl font-black text-white">{item.step}</span>
                  </div>
                  {index < 2 && (
                    <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gray-200 hidden md:block" 
                         style={{ transform: "translateX(50%)", width: "calc(100vw/3 - 80px)" }} />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection delay={0.4} className="text-center mt-12">
            <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=600" 
              alt="Expense tracking software interface" 
              className="rounded-lg card-shadow mx-auto" 
            />
          </FadeInSection>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-spacing bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeInSection>
            <p className="text-lg text-gray-600 mb-12">
              Used by early-access bookkeepers in the U.S.
            </p>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              <div className="flex items-center space-x-2">
                <Mail className="w-8 h-8 text-gray-400" />
                <span className="text-lg font-medium text-gray-500">Gmail</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-8 h-8 text-gray-400" />
                <span className="text-lg font-medium text-gray-500">Outlook</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-gray-400" />
                <span className="text-lg font-medium text-gray-500">Bank sync</span>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="section-spacing bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeInSection>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Choose how you work
              </h2>
            </FadeInSection>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeInSection delay={0.1}>
              <div className="bg-gray-50 rounded-lg p-8 card-shadow hover:card-shadow-lg transition-all duration-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Solo Mode</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  For freelancers, consultants, and self-employed pros. Automate your expenses, stay tax-ready, and never lose a receipt.
                </p>
                <Button 
                  onClick={() => setShowSignupForm(true)}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
                >
                  Start Free
                </Button>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <div className="bg-gray-50 rounded-lg p-8 card-shadow hover:card-shadow-lg transition-all duration-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Accountant Mode</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  For bookkeepers and accounting teams managing multiple clients. Includes bulk tools, client switching, and smart automation.
                </p>
                <Button 
                  onClick={() => setShowSignupForm(true)}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
                >
                  Start Free
                </Button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeInSection>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Start automating your expenses today
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                onClick={() => setShowSubscriptionForm(true)}
                variant="outline"
                className="border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Get early access
              </Button>
              <Button 
                variant="link"
                asChild
                className="text-white hover:text-gray-200 px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-200 underline"
              >
                <a href="https://calendly.com/flowbooks-associate/consultation" target="_blank" rel="noopener noreferrer">
                  Talk to an expert
                </a>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-12 border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="font-bold text-xl text-gray-900 mb-4">FlowBooks Associate</div>
              <p className="text-gray-600 mb-4">AI-powered bookkeeping service with intelligent receipt matching and bank integration.</p>
              <div className="text-sm text-gray-500">
                <p>© 2024 FlowBooks Associate. All rights reserved.</p>
                <p className="mt-2">Legal disclaimer: FlowBooks Associate is provided as-is for bookkeeping purposes. Please consult with tax professionals for specific tax advice.</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <button 
                    onClick={() => scrollToSection("features")}
                    className="hover:text-primary transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("how-it-works")}
                    className="hover:text-primary transition-colors"
                  >
                    How it works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("plans")}
                    className="hover:text-primary transition-colors"
                  >
                    How You Work
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Pricing</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {showSignupForm && (
        <SignupForm onClose={() => setShowSignupForm(false)} />
      )}
      {showSubscriptionForm && (
        <SubscriptionForm onClose={() => setShowSubscriptionForm(false)} />
      )}
    </div>
  );
}
