import { NextResponse } from 'next/server';
import { getRecruitmentPackage, getTemplatesByType, getValueProposition, getOnboardingConversation, getFAQ } from '@/lib/creator-recruitment';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pkg = getRecruitmentPackage();

    return NextResponse.json({
      success: true,
      valueProposition: getValueProposition(),
      templates: {
        all: pkg.templates,
        email: getTemplatesByType('email'),
        dm_twitter: getTemplatesByType('dm_twitter'),
        dm_linkedin: getTemplatesByType('dm_linkedin'),
        dm_discord: getTemplatesByType('dm_discord'),
      },
      onboardingConversation: getOnboardingConversation(),
      faq: getFAQ(),
      metadata: {
        templateCount: pkg.templates.length,
        onboardingSteps: pkg.onboardingConversation.length,
        faqCount: pkg.faq.length,
        targetCreatorRange: '5k-20k followers',
        targetPlatforms: ['YouTube (AI/tech)', 'Twitter', 'LinkedIn', 'Open Campus Discord'],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
