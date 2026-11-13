"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    ContactFormError,
    EMAIL_MAX_LENGTH,
    HONEYPOT_FIELD,
    isPhoneNumber,
    MESSAGE_MAX_LENGTH,
    MESSAGE_MIN_LENGTH,
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    PHONE_MAX_LENGTH,
    prepareContactChallenge,
    useContactForm,
} from "@/api/contact/useContactForm"
import { track } from "@/lib/analytics"
import SectionHeader from "@/components/Landing/Section/SectionHeader"
import Reveal from "@/components/Landing/Section/Reveal"

/** Mono-Label über den Feldern */
const LABEL_CLASS = "font-mono text-xs uppercase tracking-widest text-muted-foreground"

/** Unterstrich-Feld auf dunklem Grund; Fokus färbt die Linie und verdickt sie per Schatten */
const FIELD_CLASS = "rounded-none border-0 border-b border-border bg-transparent px-0 text-base text-foreground shadow-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:shadow-[0_1px_0_0_hsl(var(--primary))] focus-visible:ring-0 focus-visible:ring-offset-0"

export default function ContactForm() {
    const { t } = useTranslation()
    const mutation = useContactForm()

    const schema = z.object({
        name: z.string().trim().min(NAME_MIN_LENGTH, t('contact.validation.name_required')),
        email: z.string().trim().email(t('contact.validation.email_required')),
        phone: z.string().trim()
            .refine((value) => value === '' || isPhoneNumber(value), t('contact.validation.phone_invalid'))
            .optional(),
        message: z.string().trim().min(MESSAGE_MIN_LENGTH, t('contact.validation.message_min')),
        [HONEYPOT_FIELD]: z.string().optional(),
    })

    type FormData = z.infer<typeof schema>

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const errorMessage = mutation.error instanceof ContactFormError && mutation.error.code === 'rate_limited'
        ? t('contact.error_rate_limit')
        : t('contact.error')

    const onSubmit = (data: FormData) => {
        track('contact_form_submit')
        mutation.mutate(data, {
            onSuccess: () => {
                track('contact_form_success')
                reset()
            },
            onError: () => track('contact_form_error'),
        })
    }

    return (
        <section id='contact' className="relative overflow-hidden bg-background px-6 py-24 sm:px-8 md:py-32">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    id="contact"
                    title={
                        <span className="block text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
                            <span className="block">{t('contact.headline_1')}</span>
                            <span className="block italic text-teal">{t('contact.headline_2')}</span>
                        </span>
                    }
                />

                <Reveal>
                    <p className="mb-16 max-w-2xl text-lg text-muted-foreground">
                        {t('contact.subtext')}
                    </p>
                </Reveal>

                <Reveal>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        onFocusCapture={prepareContactChallenge}
                        className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16"
                        aria-label="Contact form"
                    >
                        <div className="space-y-8 text-left text-muted-foreground">
                            <div
                                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs uppercase tracking-widest"
                                aria-hidden="true"
                            >
                                <span className="h-2 w-2 rounded-full bg-teal" />
                                {t('contact.response_badge')}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                                    {t('contact.questions_headline')}
                                </h3>
                                <p className="text-sm">
                                    {t('contact.questions_body')}{" "}
                                    <a
                                        href="mailto:info@luka-lta.dev"
                                        className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    >
                                        info@luka-lta.dev
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {mutation.isSuccess && (
                                <div role="status" className="rounded-xl border border-teal/40 bg-teal/10 px-4 py-3 text-sm text-teal">
                                    {t('contact.success')}
                                </div>
                            )}
                            {mutation.isError && (
                                <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    {errorMessage}
                                </div>
                            )}

                            {/* Honeypot: für Menschen und Screenreader unsichtbar, nicht per Tab erreichbar */}
                            <div className="sr-only" aria-hidden="true">
                                <label htmlFor={HONEYPOT_FIELD}>{t('contact.honeypot_label')}</label>
                                <input
                                    id={HONEYPOT_FIELD}
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    {...register(HONEYPOT_FIELD)}
                                />
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className={LABEL_CLASS}>
                                        {t('contact.label_name')}
                                    </Label>
                                    <Input
                                        id="name"
                                        aria-invalid={errors.name ? true : undefined}
                                        aria-describedby={errors.name ? 'name-error' : undefined}
                                        type="text"
                                        placeholder={t('contact.placeholder_name')}
                                        maxLength={NAME_MAX_LENGTH}
                                        {...register('name')}
                                        className={FIELD_CLASS}
                                        aria-required="true"
                                    />
                                    {errors.name && (
                                        <p id="name-error" className="text-xs text-destructive">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className={LABEL_CLASS}>
                                        {t('contact.label_email')}
                                    </Label>
                                    <Input
                                        id="email"
                                        aria-invalid={errors.email ? true : undefined}
                                        aria-describedby={errors.email ? 'email-error' : undefined}
                                        type="email"
                                        placeholder={t('contact.placeholder_email')}
                                        maxLength={EMAIL_MAX_LENGTH}
                                        {...register('email')}
                                        className={FIELD_CLASS}
                                        autoComplete="email"
                                        aria-required="true"
                                    />
                                    {errors.email && (
                                        <p id="email-error" className="text-xs text-destructive">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className={LABEL_CLASS}>
                                    {t('contact.label_phone')}
                                </Label>
                                <Input
                                    id="phone"
                                    aria-invalid={errors.phone ? true : undefined}
                                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                                    type="tel"
                                    placeholder={t('contact.placeholder_phone')}
                                    maxLength={PHONE_MAX_LENGTH}
                                    {...register('phone')}
                                    className={FIELD_CLASS}
                                    autoComplete="tel"
                                />
                                {errors.phone && (
                                    <p id="phone-error" className="text-xs text-destructive">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className={LABEL_CLASS}>
                                    {t('contact.label_message')}
                                </Label>
                                <Textarea
                                    id="message"
                                    aria-invalid={errors.message ? true : undefined}
                                    aria-describedby={errors.message ? 'message-error' : undefined}
                                    placeholder={t('contact.placeholder_message')}
                                    maxLength={MESSAGE_MAX_LENGTH}
                                    {...register('message')}
                                    className={`min-h-[140px] ${FIELD_CLASS}`}
                                    aria-required="true"
                                />
                                {errors.message && (
                                    <p id="message-error" className="text-xs text-destructive">{errors.message.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={mutation.isPending}
                                className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 font-mono text-xs uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 md:w-auto"
                            >
                                {mutation.isPending ? t('contact.sending') : t('contact.submit')}
                                {!mutation.isPending && (
                                    <Send
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                        aria-hidden="true"
                                    />
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground">
                                {t('contact.privacy_text')}{" "}
                                <a
                                    href="/privacy"
                                    className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    {t('contact.privacy_link')}
                                </a>
                                .
                            </p>
                        </div>
                    </form>
                </Reveal>
            </div>
        </section>
    )
}
