import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2, Mail, Scale, AlertTriangle } from 'lucide-react';
import Header from '@/components/Landing/Header.tsx';
import Footer from '@/components/Landing/Footer.tsx';
import SEO from '@/components/SEO';
import { useTranslation } from 'react-i18next';

function Impressum() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background">
            <SEO title="Impressum" canonicalPath="/impressum" />
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Table of Contents */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle className="text-lg">{t('impressum.toc_title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <nav className="space-y-1">
                                    {[
                                        ['#angaben', t('impressum.toc_angaben')],
                                        ['#kontakt', t('impressum.toc_kontakt')],
                                        ['#umsatzsteuer', t('impressum.toc_umsatzsteuer')],
                                        ['#streitschlichtung', t('impressum.toc_streitschlichtung')],
                                        ['#haftung-inhalte', t('impressum.toc_haftung_inhalte')],
                                        ['#haftung-links', t('impressum.toc_haftung_links')],
                                        ['#urheberrecht', t('impressum.toc_urheberrecht')],
                                    ].map(([href, label]) => (
                                        <a
                                            key={href}
                                            href={href}
                                            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {label}
                                        </a>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <section id="angaben">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Building2 className="h-5 w-5 text-primary" />
                                        <CardTitle>{t('impressum.angaben_title')}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-1 text-sm text-muted-foreground">
                                    <p className="font-semibold text-foreground">{t('impressum.owner')}</p>
                                    <p>{t('impressum.street')}</p>
                                    <p>{t('impressum.city')}</p>
                                    <p>{t('impressum.country')}</p>
                                </CardContent>
                            </Card>
                        </section>

                        <section id="kontakt">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <CardTitle>{t('impressum.kontakt_title')}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    <p>
                                        {t('impressum.kontakt_label')}:{' '}
                                        <a
                                            href="mailto:info@luka-lta.dev"
                                            className="text-primary hover:underline"
                                        >
                                            info@luka-lta.dev
                                        </a>
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                        <section id="umsatzsteuer">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('impressum.ust_title')}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    <p>{t('impressum.ust_text')}</p>
                                </CardContent>
                            </Card>
                        </section>

                        <section id="streitschlichtung">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Scale className="h-5 w-5 text-primary" />
                                        <CardTitle>{t('impressum.streit_title')}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>
                                        {t('impressum.streit_text')}{' '}
                                        <a
                                            href="https://ec.europa.eu/consumers/odr/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            https://ec.europa.eu/consumers/odr/
                                        </a>
                                        .
                                    </p>
                                    <Separator />
                                    <p>{t('impressum.streit_note')}</p>
                                </CardContent>
                            </Card>
                        </section>

                        <section id="haftung-inhalte">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <AlertTriangle className="h-5 w-5 text-primary" />
                                        <CardTitle>{t('impressum.haftung_inhalte_title')}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>{t('impressum.haftung_inhalte_p1')}</p>
                                    <p>{t('impressum.haftung_inhalte_p2')}</p>
                                </CardContent>
                            </Card>
                        </section>

                        <section id="haftung-links">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('impressum.haftung_links_title')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>{t('impressum.haftung_links_p1')}</p>
                                    <p>{t('impressum.haftung_links_p2')}</p>
                                </CardContent>
                            </Card>
                        </section>

                        <section id="urheberrecht">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('impressum.urheberrecht_title')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-muted-foreground">
                                    <p>{t('impressum.urheberrecht_p1')}</p>
                                    <p>{t('impressum.urheberrecht_p2')}</p>
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

export default Impressum;
