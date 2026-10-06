import { z } from 'zod';

export const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;

export const leadSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone must be at most 15 digits'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  goal: z.string().trim().min(1, 'Fitness goal is required').max(100),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().trim().max(1000).optional(),
  source: z
    .enum(['free_trial', 'membership_enquiry', 'contact_form', 'phone_call', 'whatsapp'])
    .default('free_trial'),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone must be at most 15 digits'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(2, 'Message must be at least 2 characters').max(2000),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export const membershipPlanSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  tagline: z.string().trim().max(200),
  priceDisplay: z.string().trim().min(1).max(50),
  duration: z.string().trim().min(1).max(50),
  features: z.array(z.string().trim()),
  discountOffer: z.string().trim().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const trainingProgramSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(5).max(1000),
  targetAudience: z.string().trim().min(2).max(200),
  duration: z.string().trim().min(1).max(50),
  difficulty: z.enum(['All Levels', 'Beginner', 'Intermediate', 'Advanced']),
  image: z.string().min(1),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const facilitySchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(50),
  description: z.string().trim().min(5).max(1000),
  image: z.string().min(1),
  highlights: z.array(z.string().trim()),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const faqSchema = z.object({
  id: z.string().min(1),
  question: z.string().trim().min(5).max(250),
  answer: z.string().trim().min(5).max(2000),
  category: z.string().trim().default('General'),
  isPublished: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().trim().min(5).max(2000),
  source: z.enum(['Google Review', 'Member Feedback']).default('Google Review'),
  date: z.string().min(1),
  isPublished: z.boolean().default(true),
  sentiment: z.enum(['positive', 'balanced']).optional(),
});
