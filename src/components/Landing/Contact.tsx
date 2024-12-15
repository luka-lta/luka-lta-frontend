import React, { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

const Contact = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission (e.g., send email or API call)
        console.log('Form submitted:', { name, email, message })
        // Reset form fields
        setName('')
        setEmail('')
        setMessage('')
    }

    return (
        <section id="contact" className="py-20">
            <h2 className="text-3xl font-bold mb-8">Contact Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block mb-2">Message</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={4}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
                <div>
                    <div className="flex items-center mb-4">
                        <Mail size={24} className="mr-4" />
                        <span>info@luka-lta.dev</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin size={24} className="mr-4" />
                        <span>Niedersachsen, Germany</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact

