import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { name, email, phone, message } = req.body ?? {}

    if (
        typeof name !== 'string' || name.trim().length === 0 ||
        typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof message !== 'string' || message.trim().length < 10
    ) {
        return res.status(422).json({ error: 'Invalid input' })
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('Missing SMTP env vars')
        return res.status(500).json({ error: 'Server misconfigured' })
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    const safeName    = name.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const safeMessage = message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const safePhone   = (phone ?? '–').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    try {
        await transporter.sendMail({
            from: `"Luka Dev Studio" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_TO ?? 'luka@luka-lta.dev',
            replyTo: `"${safeName}" <${email}>`,
            subject: `Neue Kontaktanfrage von ${safeName}`,
            html: `
                <h2>Neue Anfrage über luka-lta.dev</h2>
                <p><b>Name:</b> ${safeName}</p>
                <p><b>E-Mail:</b> ${email}</p>
                <p><b>Telefon:</b> ${safePhone}</p>
                <hr>
                <p><b>Nachricht:</b></p>
                <p>${safeMessage}</p>
            `,
            text: `Name: ${safeName}\nE-Mail: ${email}\nTelefon: ${safePhone}\n\n${safeMessage}`,
        })
    } catch (err) {
        console.error('SMTP error:', err)
        return res.status(500).json({ error: 'Failed to send email' })
    }

    return res.status(200).json({ success: true })
}
