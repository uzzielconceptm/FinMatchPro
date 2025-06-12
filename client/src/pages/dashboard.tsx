import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Building2, CreditCard, Settings, LogOut, Receipt, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/"} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">FlowBooks Associate</h1>
              {profile?.plan_type && (
                <Badge variant="secondary" className="ml-3">
                  {profile.plan_type === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.first_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-gray-900">{profile?.first_name} {profile?.last_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{profile?.email}</p>
              </div>
              {profile?.company && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p className="text-gray-900">{profile.company}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Account Type</p>
                <Badge variant={profile?.user_type === 'accountant' ? 'default' : 'secondary'}>
                  {profile?.user_type === 'accountant' ? 'Accountant Mode' : 'Solo Mode'}
                </Badge>
              </div>
              {profile?.monthly_expenses && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Monthly Expenses</p>
                  <p className="text-gray-900">
                    {profile.monthly_expenses.replace('-', ' - ').replace('under', 'Under $').replace('over', 'Over $')}
                  </p>
                </div>
              )}
              <Separator />
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome to FlowBooks Associate</CardTitle>
                <CardDescription>
                  Your AI-powered bookkeeping service is ready to help streamline your expense tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-auto p-4 flex-col items-start">
                    <Receipt className="w-6 h-6 mb-2" />
                    <span className="font-medium">Upload Receipts</span>
                    <span className="text-xs text-gray-600">Scan and categorize expenses</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col items-start">
                    <Building2 className="w-6 h-6 mb-2" />
                    <span className="font-medium">Connect Bank</span>
                    <span className="text-xs text-gray-600">Import transactions automatically</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Receipt className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-600">Receipts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CreditCard className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">$0.00</p>
                      <p className="text-sm text-gray-600">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">0%</p>
                      <p className="text-sm text-gray-600">Matched</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Complete these steps to set up your bookkeeping workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p className="text-sm text-gray-600">Your FlowBooks Associate account is ready</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Upload Your First Receipt</p>
                      <p className="text-sm text-gray-600">Start by uploading a receipt to see our AI categorization</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Connect Your Bank</p>
                      <p className="text-sm text-gray-600">Link your business account for automatic transaction import</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}