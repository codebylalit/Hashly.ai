import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      errs.email = 'Enter a valid email.';
    }
    if (!form.message.trim()) errs.message = 'Message is required.';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-main mb-4">Contact Us</h1>
          <p className="text-text-secondary">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-background-card rounded-lg shadow-lg p-6 sm:p-8">
          {submitted ? (
            <div className="bg-accent-teal/10 text-accent-teal px-4 py-3 rounded-lg text-center">
              <p className="font-medium">Thank you for reaching out!</p>
              <p className="mt-2">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-primary-main mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-border-light'
                  } bg-background-main text-primary-main focus:outline-none focus:ring-2 focus:ring-accent-teal`}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-main mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-border-light'
                  } bg-background-main text-primary-main focus:outline-none focus:ring-2 focus:ring-accent-teal`}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary-main mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.message ? 'border-red-500' : 'border-border-light'
                  } bg-background-main text-primary-main focus:outline-none focus:ring-2 focus:ring-accent-teal`}
                  aria-invalid={!!errors.message}
                  aria-describedby="message-error"
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-500">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-accent-teal text-text-light font-medium py-2 px-4 rounded-lg hover:bg-accent-orange transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-text-secondary">
            <p>Or email us directly at:</p>
            <a
              href="mailto:visonovaofficial@gmail.com"
              className="text-accent-teal hover:text-accent-orange transition-colors duration-200"
            >
              visonovaofficial@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 