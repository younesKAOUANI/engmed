import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setStatus("sent");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 bg-paper">
      <div className="max-w-content mx-auto px-6">
        <div className="text-center mb-12">
          <span className="eyebrow text-brand-600 block mb-3">Get in touch</span>
          <h2 className="display-md text-ink-900 mb-4">Ready to start?</h2>
          <p className="body-lg text-ink-500 max-w-xl mx-auto">
            Have questions about EngMed? We'd love to hear from you.
            Sign up free or drop us a message and we'll respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="bg-surface border border-ink-100 rounded-lg p-8 shadow-1">
            <h3 className="heading-md text-ink-900 mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Ahmed Bensalem"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@clinic.fr"
                required
              />
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
              />
              <Textarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about your situation…"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={status === "sending"}
                className="w-full mt-2"
              >
                Send message
              </Button>
              {status === "sent" && (
                <p className="body-sm text-success text-center" role="status">
                  Message sent — we'll reply within 24 hours.
                </p>
              )}
              {status === "error" && (
                <p className="body-sm text-danger text-center" role="alert">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>

          {/* Map */}
          <div className="rounded-lg overflow-hidden shadow-2 border border-ink-100 h-[480px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d88888.88!2d4.8357!3d45.7640!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ea516ae922e1%3A0x408ab2ae4bb21f0!2sLyon%2C%20France!5e0!3m2!1sen!2sfr!4v1748442201136!5m2!1sen!2sfr"
              height="100%"
              width="100%"
              loading="lazy"
              allowFullScreen
              title="EngMed location map"
              className="border-0 w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
