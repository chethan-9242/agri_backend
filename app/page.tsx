import Link from "next/link"
import { Tractor, Truck, Store, ShoppingBag, Leaf, ShieldCheck, BarChart3 } from "lucide-react"
import { RoleCard } from "@/components/ui/role-card"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-md">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">FarmTrace</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary">
              How it works
            </Link>
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-primary">
              Features
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-600 hover:text-primary">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-primary text-xs font-medium mb-6 border border-green-100">
              <ShieldCheck className="h-3 w-3" />
              <span>Blockchain Verified Supply Chain</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Transparent Food Journey from <span className="text-primary">Farm to Table</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect farmers, distributors, and retailers with consumers. Ensure quality, fair pricing, and complete
              provenance for every batch of produce.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register?role=farmer">
                <Button size="lg" className="h-12 px-8 text-base">
                  Join as Farmer
                </Button>
              </Link>
              <Link href="/auth/register?role=consumer">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white">
                  Shop Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Role Selection */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Tailored tools for every stakeholder in the agricultural supply chain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <RoleCard
                title="Farmer"
                description="Manage harvests, create batches with AI quality checks, and track payments directly."
                icon={<Tractor className="h-6 w-6" />}
                href="/auth/login?role=farmer"
                colorClass="bg-[#0F7A5D]"
              />
              <RoleCard
                title="Distributor"
                description="Efficiently manage logistics, track pickups, and ensure timely delivery to warehouses."
                icon={<Truck className="h-6 w-6" />}
                href="/auth/login?role=distributor"
                colorClass="bg-blue-600"
              />
              <RoleCard
                title="Retailer"
                description="Source fresh produce, manage inventory prices, and offer discounts based on quality."
                icon={<Store className="h-6 w-6" />}
                href="/auth/login?role=retailer"
                colorClass="bg-purple-600"
              />
              <RoleCard
                title="Consumer"
                description="Scan QR codes to see the full journey, check freshness scores, and verify fair pricing."
                icon={<ShoppingBag className="h-6 w-6" />}
                href="/auth/login?role=consumer"
                colorClass="bg-[#F9A826]"
              />
            </div>
          </div>
        </section>

        {/* Feature Highlight */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Blockchain Verified</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every step of the journey is recorded on an immutable ledger for complete trust.
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Fair Pricing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Transparent price breakdown showing what the farmer, distributor, and retailer earns.
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Quality Check</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Smart analysis of produce photos to grade freshness and quality automatically.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1 rounded-md">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-gray-900">FarmTrace</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 FarmTrace. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm">
              Privacy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
