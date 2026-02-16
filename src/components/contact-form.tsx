import { useState } from 'react'
import { Send } from 'lucide-react'

import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitStatus('success')
    setFormData({ name: '', email: '', subject: '', message: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="border-border/50 shadow-xl shadow-primary/5 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="space-y-3 pb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl w-fit shadow-lg shadow-primary/10">
          <Send className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Send us a message</CardTitle>
        <CardDescription className="text-base">
          Fill out the form below and we'll get back to you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="name" className="text-sm font-semibold">
              Name
            </FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-2 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 bg-background/50"
              placeholder="Your full name"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email" className="text-sm font-semibold">
              Email
            </FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-2 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 bg-background/50"
              placeholder="your.email@example.com"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="subject" className="text-sm font-semibold">
              Subject
            </FieldLabel>
            <Input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              className="mt-2 h-12 border-border/50 focus:border-primary/50 focus:ring-primary/20 bg-background/50"
              placeholder="What is this regarding?"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="message" className="text-sm font-semibold">
              Message
            </FieldLabel>
            <Textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="mt-2 border-border/50 focus:border-primary/50 focus:ring-primary/20 bg-background/50 resize-none"
              placeholder="Tell us more about your inquiry..."
            />
          </Field>

          {submitStatus === 'success' && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 animate-in fade-in slide-in-from-top-2">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Thank you! Your message has been sent successfully.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Something went wrong. Please try again.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {isSubmitting ? (
              <>
                <span className="animate-pulse">Sending...</span>
              </>
            ) : (
              <>
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
