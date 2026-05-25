"use client"

import { motion, Variants } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, Phone, Send } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useContactForm } from "@/api/contact/useContactForm"

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.14, delayChildren: 0.2 },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
}

const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.35, ease: "easeOut" },
    },
}

export default function ContactForm() {
    const { t } = useTranslation()
    const mutation = useContactForm()

    const schema = z.object({
        name: z.string().min(1, t('contact.validation.name_required')),
        email: z.string().email(t('contact.validation.email_required')),
        phone: z.string().optional(),
        message: z.string().min(10, t('contact.validation.message_min')),
    })

    type FormData = z.infer<typeof schema>

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = (data: FormData) => {
        mutation.mutate(data, {
            onSuccess: () => reset(),
        })
    }

    return (
        <section id='contact' className="relative overflow-hidden bg-background px-6 py-24 sm:px-8 md:py-28">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-6 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-foreground/[0.035] blur-[140px]" />
                <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-primary/[0.03] blur-[130px]" />
            </div>

            <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    <span className="section-badge inline-flex">{t('contact.badge')}</span>
                    <h2 className="text-5xl font-black tracking-tight text-foreground md:text-6xl">
                        {t('contact.headline_1')}<br />{t('contact.headline_2')}
                    </h2>
                    <p className="max-w-2xl text-foreground/70">
                        {t('contact.subtext')}
                    </p>
                </motion.div>

                <Card className="group relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-0 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        className="relative grid gap-10 px-6 py-8 md:grid-cols-2 md:px-10 md:py-12"
                        aria-label="Contact form"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="space-y-8 text-left text-foreground/70"
                        >
                            <motion.div
                                variants={iconVariants}
                                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground/70 backdrop-blur"
                                aria-hidden="true"
                            >
                                <span className="h-2 w-2 rounded-full bg-primary/80" />
                                {t('contact.response_badge')}
                            </motion.div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                                    {t('contact.questions_headline')}
                                </h3>
                                <p className="text-sm text-foreground/70">
                                    {t('contact.questions_body')}{" "}
                                    <a
                                        href="mailto:info@luka-lta.dev"
                                        className="text-foreground underline decoration-border/70 underline-offset-4 transition-colors hover:text-primary"
                                    >
                                        info@luka-lta.dev
                                    </a>
                                    .
                                </p>
                            </div>

                            <div className="grid gap-4 text-sm text-foreground/70">
                                <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/40 p-3">
                                    <Mail
                                        className="mt-0.5 h-4 w-4 text-foreground/60"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Email</p>
                                        <p>info@luka-lta.dev</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-6">
                            {mutation.isSuccess && (
                                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                                    {t('contact.success')}
                                </div>
                            )}
                            {mutation.isError && (
                                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    {t('contact.error')}
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
                                    >
                                        {t('contact.label_name')}
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t('contact.placeholder_name')}
                                        {...register('name')}
                                        className="rounded-xl border border-border/40 bg-background/40 text-sm text-foreground transition-all focus-visible:border-border/60 focus-visible:ring-2 focus-visible:ring-primary/30"
                                        aria-required="true"
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-destructive">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
                                    >
                                        {t('contact.label_email')}
                                    </Label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50"
                                            aria-hidden="true"
                                        />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder={t('contact.placeholder_email')}
                                            {...register('email')}
                                            className="rounded-xl border border-border/40 bg-background/40 pl-10 text-sm text-foreground transition-all focus-visible:border-border/60 focus-visible:ring-2 focus-visible:ring-primary/30"
                                            autoComplete="email"
                                            aria-required="true"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-destructive">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
                                >
                                    {t('contact.label_phone')}
                                </Label>
                                <div className="relative">
                                    <Phone
                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50"
                                        aria-hidden="true"
                                    />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder={t('contact.placeholder_phone')}
                                        {...register('phone')}
                                        className="rounded-xl border border-border/40 bg-background/40 pl-10 text-sm text-foreground transition-all focus-visible:border-border/60 focus-visible:ring-2 focus-visible:ring-primary/30"
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="message"
                                    className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
                                >
                                    {t('contact.label_message')}
                                </Label>
                                <div className="relative">
                                    <MessageSquare
                                        className="absolute left-3 top-3 h-4 w-4 text-foreground/50"
                                        aria-hidden="true"
                                    />
                                    <Textarea
                                        id="message"
                                        placeholder={t('contact.placeholder_message')}
                                        {...register('message')}
                                        className="min-h-[140px] rounded-xl border border-border/40 bg-background/40 pl-10 text-sm text-foreground transition-all focus-visible:border-border/60 focus-visible:ring-2 focus-visible:ring-primary/30"
                                        aria-required="true"
                                    />
                                </div>
                                {errors.message && (
                                    <p className="text-xs text-destructive">{errors.message.message}</p>
                                )}
                            </div>

                            <motion.div variants={itemVariants}>
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={mutation.isPending}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-60"
                                >
                                    {mutation.isPending ? t('contact.sending') : t('contact.submit')}
                                    {!mutation.isPending && (
                                        <Send
                                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                            aria-hidden="true"
                                        />
                                    )}
                                </Button>
                            </motion.div>

                            <p className="text-xs text-foreground/60">
                                {t('contact.privacy_text')}{" "}
                                <a
                                    href="/privacy"
                                    className="text-foreground underline decoration-border/70 underline-offset-4 transition-colors hover:text-primary"
                                >
                                    {t('contact.privacy_link')}
                                </a>
                                .
                            </p>
                        </motion.div>
                    </motion.form>
                </Card>
            </div>
        </section>
    )
}
