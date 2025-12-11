import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, MapPin, BarChart3, Users } from "lucide-react"

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b border-border bg-card sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="favicon-32x32.png" alt="logo" />
                        <span className="text-xl font-bold text-primary">EcoCollect</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="#services" className="text-foreground hover:text-primary transition">
                            Services
                        </Link>
                        <Link href="#about" className="text-foreground hover:text-primary transition">
                            About
                        </Link>
                        <Link href="/contact" className="text-foreground hover:text-primary transition">
                            Contact
                        </Link>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
                        Smart Waste Management for Sustainable Cities
                    </h1>
                    <p className="text-lg md:text-xl text-foreground/80 text-balance">
                        EcoCollect streamlines waste collection with real-time tracking, intelligent routing, and comprehensive
                        analytics to build a cleaner tomorrow.
                    </p>
                    <div className="flex gap-4 justify-center pt-4">
                        <Button size="lg" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="#services">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Our Services</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-border transition hover:shadow-md hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex justify-center">
                                    <MapPin className="w-8 h-8 text-primary mb-2" />
                                </div>
                                <CardTitle>Real-Time Tracking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/80">
                                    Track collection vehicles and waste containers in real-time with GPS integration.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border transition hover:shadow-md hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex justify-center">
                                    <Users className="w-8 h-8 text-primary mb-2" />
                                </div>
                                <CardTitle>Smart Scheduling</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/80">
                                    Optimize collection routes and schedules based on fill levels and demand.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border transition hover:shadow-md hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex justify-center">
                                    <BarChart3 className="w-8 h-8 text-primary mb-2" />
                                </div>
                                <CardTitle>Analytics Dashboard</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/80">
                                    Monitor emissions, recycling rates, and environmental impact metrics.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border transition hover:shadow-md hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex justify-center">
                                    <Leaf className="w-8 h-8 text-primary mb-2" />
                                </div>
                                <CardTitle>Eco-Friendly</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/80">
                                    Reduce carbon footprint through optimized collection and waste management.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 px-4 bg-secondary/5 items-center text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#005400]">About EcoCollect</h2>
                    <p className="text-lg text-foreground/80 text-balance">
                        EcoCollect is a comprehensive waste management platform designed for modern cities. We connect citizens,
                        collection agents, and administrators to create a seamless waste collection ecosystem that reduces
                        environmental impact while improving operational efficiency.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 pt-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-primary">1000+</h3>
                            <p className="text-foreground/80">Active Collection Points</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-primary">50K+</h3>
                            <p className="text-foreground/80">Citizens Engaged</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-primary">10K</h3>
                            <p className="text-foreground/80">Tons CO₂ Saved</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-8 px-4 mt-16">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="favicon-32x32.png" alt="logo" />
                            <span className="font-bold text-primary">EcoCollect</span>
                        </div>
                        <p className="text-foreground/80">Making cities cleaner, one collection at a time.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-foreground">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/login" className="text-foreground/80 hover:text-primary">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup" className="text-foreground/80 hover:text-primary">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link href="#services" className="text-foreground/80 hover:text-primary">
                                    Services
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-foreground">Contact</h4>
                        <p className="text-foreground/80">support@ecocollect.io</p>
                        <p className="text-foreground/80">+1 (555) 123-4567</p>
                    </div>
                </div>
                <div className="border-t border-border mt-8 pt-8 text-center text-foreground/60">
                    <p>&copy; 2025 EcoCollect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
