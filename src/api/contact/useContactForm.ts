import { useMutation } from '@tanstack/react-query'
import { FetchWrapper } from '@/lib/fetchWrapper'
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
        mutationFn: (data: ContactFormData) => {
            const fw = new FetchWrapper(FetchWrapper.baseUrl)
            return fw.post('/contact', data)
        },
    })
}
