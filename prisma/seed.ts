import {
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_FACILITIES,
  DEFAULT_FAQS,
  DEFAULT_GALLERY,
  DEFAULT_MEMBERSHIP_PLANS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_TRAINING_PROGRAMS,
  INITIAL_SAMPLE_LEADS,
} from '../src/data/defaultData';
import { hashPassword } from '../src/lib/auth';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('--- Initializing Database Seed ---');

  // Seed default admin user if not exists
  const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@shirsekarfitness.com').toLowerCase().trim();
  const rawPass = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
  const hashedPassword = await hashPassword(rawPass);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    console.log(`Creating default admin user: ${adminEmail}`);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: "Shirsekar's Hub Admin",
        password: hashedPassword,
        role: 'super_admin',
      },
    });
  }

  // Seed business settings if not exists
  const existingSettings = await prisma.businessSetting.findUnique({
    where: { id: 'default' },
  });

  if (!existingSettings) {
    console.log('Seeding default business settings...');
    await prisma.businessSetting.create({
      data: {
        id: 'default',
        ...DEFAULT_BUSINESS_SETTINGS,
      },
    });
  }

  // Seed facilities
  for (const fac of DEFAULT_FACILITIES) {
    await prisma.facility.upsert({
      where: { id: fac.id },
      update: {},
      create: fac,
    });
  }

  // Seed programs
  for (const prog of DEFAULT_TRAINING_PROGRAMS) {
    await prisma.trainingProgram.upsert({
      where: { id: prog.id },
      update: {},
      create: prog,
    });
  }

  // Seed memberships
  for (const plan of DEFAULT_MEMBERSHIP_PLANS) {
    await prisma.membershipPlan.upsert({
      where: { id: plan.id },
      update: {},
      create: plan,
    });
  }

  // Seed gallery
  for (const item of DEFAULT_GALLERY) {
    await prisma.galleryItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // Seed testimonials (authentic verified reviews)
  for (const review of DEFAULT_TESTIMONIALS) {
    await prisma.testimonial.upsert({
      where: { id: review.id },
      update: {},
      create: review,
    });
  }

  // Seed FAQs
  for (const faq of DEFAULT_FAQS) {
    await prisma.faqItem.upsert({
      where: { id: faq.id },
      update: {},
      create: faq,
    });
  }

  // Seed initial sample leads only if empty
  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    console.log('Seeding initial sample leads...');
    for (const lead of INITIAL_SAMPLE_LEADS) {
      await prisma.lead.create({
        data: {
          ...lead,
          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt),
        },
      });
    }
  }

  console.log('--- Database Seed Finished Successfully ---');
}

main()
  .catch((e) => {
    console.error('Database seed failed:', e);
    process.exit(1);
  });
