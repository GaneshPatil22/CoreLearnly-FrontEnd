import { useState } from 'react';
import { motion } from 'framer-motion';
import type { EnquiryFormData } from '../../types';
import {
  validateEmail,
  validatePhone,
  validateFullName,
  validateEducation,
  validateMessage,
  validateSource,
} from '../../utils/validation';
import { submitEnquiry } from '../../queries/enquiries';
import LoadingSpinner from '../common/LoadingSpinner';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  educationOrProfession?: string;
  message?: string;
  source?: string;
}

type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

const ApplicationForm = () => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    educationOrProfession: '',
    message: '',
    source: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [submissionError, setSubmissionError] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field: keyof EnquiryFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof EnquiryFormData) => {
    let error: string | null = null;

    switch (field) {
      case 'fullName':
        error = validateFullName(formData.fullName);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'educationOrProfession':
        error = validateEducation(formData.educationOrProfession);
        break;
      case 'message':
        error = validateMessage(formData.message);
        break;
      case 'source':
        error = validateSource(formData.source);
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return error === null;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const educationError = validateEducation(formData.educationOrProfession);
    if (educationError) newErrors.educationOrProfession = educationError;

    const messageError = validateMessage(formData.message);
    if (messageError) newErrors.message = messageError;

    const sourceError = validateSource(formData.source);
    if (sourceError) newErrors.source = sourceError;

    setErrors(newErrors);

    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      educationOrProfession: true,
      message: true,
      source: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmissionState('loading');
    setSubmissionError('');

    try {
      const result = await submitEnquiry(formData);

      if (result.success) {
        setSubmissionState('success');
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          educationOrProfession: '',
          message: '',
          source: '',
        });
        setTouched({});
        setErrors({});
      } else {
        setSubmissionState('error');
        setSubmissionError('Failed to submit application. Please try again.');
      }
    } catch (error) {
      setSubmissionState('error');
      setSubmissionError('An unexpected error occurred. Please try again.');
      console.error('Submission error:', error);
    }
  };

  // Reset submission state after showing success/error
  const resetSubmissionState = () => {
    setSubmissionState('idle');
    setSubmissionError('');
  };

  const sourceOptions = [
    { value: '', label: 'Select an option' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      {submissionState === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-white font-semibold mb-1">Application Submitted!</h3>
              <p className="text-dark-text-secondary text-sm">
                Thank you for applying to CoreLearnly. We'll review your application and get back to you soon.
              </p>
              <button
                onClick={resetSubmissionState}
                className="text-primary hover:text-primary-400 text-sm font-medium mt-2"
              >
                Submit another application →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {submissionState === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-white font-semibold mb-1">Submission Failed</h3>
              <p className="text-dark-text-secondary text-sm">{submissionError}</p>
              <button
                onClick={resetSubmissionState}
                className="text-primary hover:text-primary-400 text-sm font-medium mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-white font-medium mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={() => handleBlur('fullName')}
            className={`w-full px-4 py-3 bg-dark-bg border ${
              touched.fullName && errors.fullName
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-border focus:border-primary'
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors`}
            placeholder="Enter your full name"
          />
          {touched.fullName && errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-white font-medium mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            className={`w-full px-4 py-3 bg-dark-bg border ${
              touched.email && errors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-border focus:border-primary'
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors`}
            placeholder="your.email@example.com"
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-white font-medium mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
            className={`w-full px-4 py-3 bg-dark-bg border ${
              touched.phone && errors.phone
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-border focus:border-primary'
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors`}
            placeholder="+1 (555) 123-4567"
          />
          {touched.phone && errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Education/Profession */}
        <div>
          <label htmlFor="educationOrProfession" className="block text-white font-medium mb-2">
            Education / Current Profession <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="educationOrProfession"
            name="educationOrProfession"
            value={formData.educationOrProfession}
            onChange={handleChange}
            onBlur={() => handleBlur('educationOrProfession')}
            className={`w-full px-4 py-3 bg-dark-bg border ${
              touched.educationOrProfession && errors.educationOrProfession
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-border focus:border-primary'
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors`}
            placeholder="e.g., B.Tech CSE Student, Software Engineer"
          />
          {touched.educationOrProfession && errors.educationOrProfession && (
            <p className="text-red-500 text-sm mt-1">{errors.educationOrProfession}</p>
          )}
        </div>

        {/* Source */}
        <div>
          <label htmlFor="source" className="block text-white font-medium mb-2">
            How did you hear about us? <span className="text-red-500">*</span>
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            onBlur={() => handleBlur('source')}
            className={`w-full px-4 py-3 bg-dark-bg border ${
              touched.source && errors.source
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-border focus:border-primary'
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors`}
          >
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {touched.source && errors.source && (
            <p className="text-red-500 text-sm mt-1">{errors.source}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-white font-medium mb-2">
            Why do you want to join CoreLearnly? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={() => handleBlur('message')}
            rows={5}
            className={`w-full px-4 py-3 bg-dark-bg border ${
              touched.message && errors.message
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-border focus:border-primary'
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none`}
            placeholder="Tell us about your goals, what you hope to learn, and why you're interested in this program..."
          />
          {touched.message && errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
          <p className="text-dark-text-muted text-sm mt-1">
            {formData.message.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={submissionState === 'loading'}
            whileHover={{ scale: submissionState === 'loading' ? 1 : 1.02 }}
            whileTap={{ scale: submissionState === 'loading' ? 1 : 0.98 }}
            className={`w-full px-8 py-4 rounded-lg font-semibold text-white transition-all ${
              submissionState === 'loading'
                ? 'bg-primary/50 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-600 glow'
            }`}
          >
            {submissionState === 'loading' ? (
              <span className="flex items-center justify-center gap-3">
                <LoadingSpinner size="sm" />
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </motion.button>
        </div>

        <p className="text-dark-text-muted text-sm text-center">
          By submitting this form, you agree to our{' '}
          <a href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
};

export default ApplicationForm;
