import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

export const ContactFormSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().min(10),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

export function useContactForm() {
    return useMutation({
        mutationFn: async (data: ContactFormData) => {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`)
            }

            return res.json()
        },
    })
}
