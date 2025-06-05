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
    <div className="font-sans text-gray-900 overflow-x-hidden">
      <Navigation onSubscriptionClick={() => setShowSubscriptionForm(true)} />

      {/* Hero Section */}
      <section className="relative section-spacing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8 text-shadow-sm">
                Track expenses, receipts, and bank transactions — without the spreadsheets.
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                A higher-quality AI-powered bookkeeping service for solopreneurs and accountants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => scrollToSection("how-it-works")}
                  className="border-2 border-primary/20 hover:border-primary bg-white/80 text-gray-700 hover:text-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 card-shadow"
                >
                  See how it works
                </Button>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Modern business dashboard" 
                  className="rounded-2xl card-shadow-lg w-full" 
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Primary Pain Section */}
      <section className="section-spacing bg-white/60">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeInSection>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-shadow-sm">
              Why manual tracking doesn't scale
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Manual expense tracking wastes hours and leads to missed deductions or audit stress.
            </p>
          </FadeInSection>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <FadeInSection delay={0.1} className="text-center p-8 bg-white/80 rounded-2xl card-shadow">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Time Consuming</h3>
              <p className="text-gray-600 leading-relaxed">Hours spent sorting through receipts and categorizing expenses</p>
            </FadeInSection>
            <FadeInSection delay={0.2} className="text-center p-8 bg-white/80 rounded-2xl card-shadow">
              <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Error Prone</h3>
              <p className="text-gray-600 leading-relaxed">Manual entry leads to mistakes and missed deductions</p>
            </FadeInSection>
            <FadeInSection delay={0.3} className="text-center p-8 bg-white/80 rounded-2xl card-shadow">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileX className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Audit Stress</h3>
              <p className="text-gray-600 leading-relaxed">Disorganized records create anxiety during tax season</p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Primary Benefit Section */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Financial automation dashboard" 
                  className="rounded-2xl card-shadow-lg w-full" 
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-shadow-sm">
                How FinMatch simplifies everything
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                FinMatch connects your inbox and bank — receipts are matched, categorized, and ready to export.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl card-shadow">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Automatic receipt extraction from email</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl card-shadow">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Smart matching with bank transactions</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl card-shadow">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Tax-ready categorization and exports</span>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing bg-white/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <FadeInSection>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-shadow-sm">
                Key features built for real workflows
              </h2>
            </FadeInSection>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <FadeInSection key={index} delay={index * 0.1} className="bg-white/90 rounded-2xl p-8 hover:card-shadow-lg transition-all duration-300 hover:scale-105 group">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.subtitle}</p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-spacing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <FadeInSection>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-shadow-sm">
                How it works
              </h2>
            </FadeInSection>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Connect your email and bank",
                description: "Securely link your Gmail, Outlook, and bank accounts through our encrypted connections."
              },
              {
                step: "2", 
                title: "FinMatch finds and matches receipts",
                description: "Our AI automatically extracts receipts from your inbox and matches them to bank transactions."
              },
              {
                step: "3",
                title: "You get a clean, categorized record", 
                description: "Access your organized expenses with proper tax categories, ready for export or accountant review."
              }
            ].map((item, index) => (
              <FadeInSection key={index} delay={index * 0.2} className="text-center">
                <div className="relative mb-10">
                  <div className="w-24 h-24 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 card-shadow">
                    <span className="text-3xl font-bold text-white text-shadow-sm">{item.step}</span>
                  </div>
                  {index < 2 && (
                    <div className="absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-primary/30 to-primary/10 hidden md:block rounded-full" 
                         style={{ transform: "translateX(50%)", width: "calc(100vw/3 - 96px)" }} />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection delay={0.4} className="text-center mt-20">
            <div className="relative max-w-4xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=600" 
                alt="Expense tracking software interface" 
                className="rounded-2xl card-shadow-lg mx-auto w-full" 
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
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
      <section id="plans" className="section-spacing bg-white/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <FadeInSection>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-shadow-sm">
                Choose how you work
              </h2>
            </FadeInSection>
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <FadeInSection delay={0.1}>
              <div className="bg-white/90 rounded-3xl p-10 hover:card-shadow-lg transition-all duration-300 hover:scale-105 group">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Solo Mode</h3>
                <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                  For freelancers, consultants, and self-employed pros. Automate your expenses, stay tax-ready, and never lose a receipt.
                </p>
                <Button 
                  onClick={() => setShowSignupForm(true)}
                  className="w-full gradient-primary text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105 card-shadow text-shadow-sm"
                >
                  Start Free Trial
                </Button>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <div className="bg-white/90 rounded-3xl p-10 hover:card-shadow-lg transition-all duration-300 hover:scale-105 group">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Accountant Mode</h3>
                <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                  For bookkeepers and accounting teams managing multiple clients. Includes bulk tools, client switching, and smart automation.
                </p>
                <Button 
                  onClick={() => setShowSignupForm(true)}
                  className="w-full gradient-primary text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105 card-shadow text-shadow-sm"
                >
                  Start Free Trial
                </Button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeInSection>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Start automating your expenses today
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                onClick={() => setShowSubscriptionForm(true)}
                variant="outline"
                className="border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105"
              >
                Get early access
              </Button>
              <Button 
                variant="link"
                asChild
                className="text-white hover:text-gray-200 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 underline"
              >
                <a href="https://calendly.com/finmatch-service/consultation" target="_blank" rel="noopener noreferrer">
                  Talk to an expert
                </a>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="font-bold text-xl text-gray-900 mb-4">FinMatch Service</div>
              <p className="text-gray-600 mb-4">AI-powered bookkeeping service with intelligent receipt matching and bank integration.</p>
              <div className="text-sm text-gray-500">
                <p>© 2024 FinMatch Service. All rights reserved.</p>
                <p className="mt-2">Legal disclaimer: FinMatch Service is provided as-is for bookkeeping purposes. Please consult with tax professionals for specific tax advice.</p>
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
