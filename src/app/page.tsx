// src/app/page.tsx - COMPLETE HOMEPAGE
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingBag, Truck, Shield, Star, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-primary">Alaba Market</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 inline-flex items-center rounded-full border bg-background px-4 py-2 text-sm">
                <Star className="mr-2 h-4 w-4 text-primary" />
                <span>N{`igeria's Premier Online Marketplace`}</span>
              </div>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                Welcome to{' '}
                <span className="text-primary">Alaba Market</span>
              </h1>
              
              <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
      {`          Discover authentic products from Nigeria's largest electronics and
                fashion market. Shop with confidence and get your items delivered
                safely to your doorstep.`}
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/products">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/register">Join as Seller</Link>
                </Button>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">5K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">1K+</div>
                  <div className="text-sm text-muted-foreground">Sellers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Why Choose Alaba Market</h2>
              <p className="mt-2 text-muted-foreground">
                Experience the best of online shopping in Nigeria
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Wide Selection</CardTitle>
                  <CardDescription>
                    Thousands of products from trusted sellers in Alaba
                    International Market
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Fast Delivery</CardTitle>
                  <CardDescription>
                    Track your order in real-time from pickup to delivery with our
                    advanced tracking system
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Secure Payment</CardTitle>
                  <CardDescription>
                    Safe and secure payment processing with delivery code
                    verification system
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Popular Categories</h2>
              <p className="mt-2 text-muted-foreground">
                Explore our most popular product categories
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: 'Electronics',
                  image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
                  count: '2,500+ items',
                },
                {
                  name: 'Fashion',
                  image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
                  count: '3,200+ items',
                },
                {
                  name: 'Home & Garden',
                  image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
                  count: '1,800+ items',
                },
                {
                  name: 'Sports',
                  image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
                  count: '1,200+ items',
                },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={`/products?category=${category.name}`}
                  className="group"
                >
                  <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={category.image || '/placeholder.png'}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="mt-2 text-muted-foreground">
                Get started in just 4 simple steps
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  step: '1',
                  title: 'Create Account',
                  description: 'Sign up as a buyer, seller, or delivery partner',
                },
                {
                  step: '2',
                  title: 'Browse Products',
                  description: 'Explore thousands of products from verified sellers',
                },
                {
                  step: '3',
                  title: 'Place Order',
                  description: 'Add items to cart and checkout securely',
                },
                {
                  step: '4',
                  title: 'Track Delivery',
                  description: 'Monitor your order in real-time until delivery',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <Card className="overflow-hidden border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-8 text-center md:p-12">
                <h2 className="mb-4 text-3xl font-bold">
                  Ready to Start Shopping?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Join thousands of satisfied customers shopping from Alaba Market today
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Create Free Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <Package className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">Alaba Market</span>
              </div>
              <p className="text-sm text-muted-foreground">
               {` Your trusted marketplace for electronics, fashion, and more from Nigeria's
                largest market.`}
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products" className="text-muted-foreground hover:text-foreground">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Electronics" className="text-muted-foreground hover:text-foreground">
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Fashion" className="text-muted-foreground hover:text-foreground">
                    Fashion
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-muted-foreground hover:text-foreground">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Alaba Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

