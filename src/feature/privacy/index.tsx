import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Eye, Lock, Users, Mail, FileText} from "lucide-react"
import {Separator} from "@/components/ui/separator"
import Header from "@/components/Landing/Header.tsx";
import Footer from "@/components/Landing/Footer.tsx";


function Privacy() {
    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Table of Contents */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle className="text-lg">Contents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <nav className="space-y-1">
                                    <a
                                        href="#overview"
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Overview
                                    </a>
                                    <a
                                        href="#information-collection"
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Information We Collect
                                    </a>
                                    <a
                                        href="#information-use"
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        How We Use Information
                                    </a>
                                    <a
                                        href="#information-sharing"
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Information Sharing
                                    </a>
                                    <a
                                        href="#data-security"
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Data Security
                                    </a>
                                    <a
                                        href="#cookies"
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Cookies & Tracking
                                    </a>
                                    <a
                                        href="#user-rights"
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Your Rights
                                    </a>
                                    <a
                                        href="#contact"
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Contact Us
                                    </a>
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Overview */}
                        <section id="overview">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Eye className="h-5 w-5 text-primary"/>
                                        <CardTitle>Privacy Policy Overview</CardTitle>
                                    </div>
                                    <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent className="prose prose-sm max-w-none">
                                    <p>
                                        At our company, we are committed to protecting your privacy and ensuring the
                                        security of your
                                        personal information. This Privacy Policy explains how we collect, use,
                                        disclose, and safeguard your
                                        information when you visit our website or use our services.
                                    </p>
                                    <p>
                                        By using our services, you agree to the collection and use of information in
                                        accordance with this
                                        policy. We will not use or share your information with anyone except as
                                        described in this Privacy
                                        Policy.
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Information Collection */}
                        <section id="information-collection">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-primary"/>
                                        <CardTitle>Information We Collect</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Personal Information</h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            We may collect personally identifiable information that you voluntarily
                                            provide to us when you:
                                        </p>
                                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                                            <li>• Register for an account</li>
                                            <li>• Subscribe to our newsletter</li>
                                            <li>• Contact us through our support channels</li>
                                            <li>• Participate in surveys or promotions</li>
                                        </ul>
                                    </div>

                                    <Separator/>

                                    <div>
                                        <h4 className="font-semibold mb-2">Usage Information</h4>
                                        <p className="text-sm text-muted-foreground">
                                            We automatically collect certain information about your device and how you
                                            interact with our
                                            services, including IP address, browser type, operating system, referring
                                            URLs, and pages visited.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Information Use */}
                        <section id="information-use">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-5 w-5 text-primary"/>
                                        <CardTitle>How We Use Your Information</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Service Provision</h4>
                                            <ul className="text-sm text-muted-foreground space-y-1">
                                                <li>• Provide and maintain our services</li>
                                                <li>• Process transactions</li>
                                                <li>• Send service-related communications</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Improvement & Analytics</h4>
                                            <ul className="text-sm text-muted-foreground space-y-1">
                                                <li>• Analyze usage patterns</li>
                                                <li>• Improve our services</li>
                                                <li>• Develop new features</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Information Sharing */}
                        <section id="information-sharing">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Information Sharing and Disclosure</CardTitle>
                                </CardHeader>
                                <CardContent className="prose prose-sm max-w-none">
                                    <p>
                                        We do not sell, trade, or otherwise transfer your personal information to third
                                        parties without your
                                        consent, except in the following circumstances:
                                    </p>
                                    <ul>
                                        <li>
                                            <strong>Service Providers:</strong> We may share information with trusted
                                            third-party service
                                            providers who assist us in operating our services.
                                        </li>
                                        <li>
                                            <strong>Legal Requirements:</strong> We may disclose information when
                                            required by law or to
                                            protect our rights and safety.
                                        </li>
                                        <li>
                                            <strong>Business Transfers:</strong> Information may be transferred in
                                            connection with a merger,
                                            acquisition, or sale of assets.
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Data Security */}
                        <section id="data-security">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Lock className="h-5 w-5 text-primary"/>
                                        <CardTitle>Data Security</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="prose prose-sm max-w-none">
                                    <p>
                                        We implement appropriate technical and organizational security measures to
                                        protect your personal
                                        information against unauthorized access, alteration, disclosure, or destruction.
                                        These measures
                                        include:
                                    </p>
                                    <ul>
                                        <li>Encryption of data in transit and at rest</li>
                                        <li>Regular security assessments and updates</li>
                                        <li>Access controls and authentication measures</li>
                                        <li>Employee training on data protection practices</li>
                                    </ul>
                                    <p>
                                        However, no method of transmission over the internet or electronic storage is
                                        100% secure, and we
                                        cannot guarantee absolute security.
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Cookies */}
                        <section id="cookies">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cookies and Tracking Technologies</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        We use cookies and similar tracking technologies to enhance your experience on
                                        our website. You can
                                        control cookie settings through your browser preferences.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 border rounded-lg">
                                            <h4 className="font-semibold mb-2">Essential Cookies</h4>
                                            <p className="text-xs text-muted-foreground">Required for basic website
                                                functionality</p>
                                        </div>
                                        <div className="p-4 border rounded-lg">
                                            <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                                            <p className="text-xs text-muted-foreground">Help us understand how you use
                                                our site</p>
                                        </div>
                                        <div className="p-4 border rounded-lg">
                                            <h4 className="font-semibold mb-2">Marketing Cookies</h4>
                                            <p className="text-xs text-muted-foreground">Used to deliver relevant
                                                advertisements</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* User Rights */}
                        <section id="user-rights">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Privacy Rights</CardTitle>
                                </CardHeader>
                                <CardContent className="prose prose-sm max-w-none">
                                    <p>
                                        Depending on your location, you may have the following rights regarding your
                                        personal information:
                                    </p>
                                    <ul>
                                        <li>
                                            <strong>Access:</strong> Request a copy of the personal information we hold
                                            about you
                                        </li>
                                        <li>
                                            <strong>Rectification:</strong> Request correction of inaccurate or
                                            incomplete information
                                        </li>
                                        <li>
                                            <strong>Erasure:</strong> Request deletion of your personal information
                                        </li>
                                        <li>
                                            <strong>Portability:</strong> Request transfer of your data to another
                                            service provider
                                        </li>
                                        <li>
                                            <strong>Objection:</strong> Object to certain types of processing
                                        </li>
                                    </ul>
                                    <p>To exercise these rights, please contact us using the information provided
                                        below.</p>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Contact */}
                        <section id="contact">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-5 w-5 text-primary"/>
                                        <CardTitle>Contact Information</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        If you have any questions about this Privacy Policy or our privacy practices,
                                        please contact us:
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Email</h4>
                                            <p className="text-sm text-muted-foreground">info@luka-lta.dev</p>
                                        </div>
{/*                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Address</h4>
                                            <p className="text-sm text-muted-foreground">
                                                123 Privacy Street
                                                <br/>
                                                Suite 100
                                                <br/>
                                                City, State 12345
                                            </p>
                                        </div>*/}
                                    </div>

                                    <div className="pt-4 border-t">
                                        <p className="text-xs text-muted-foreground">
                                            We will respond to your inquiry within 30 days of receipt.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Privacy;