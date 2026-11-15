import { Metadata } from 'next';
import { getServerStoreData } from '@/src/lib/serverDataLoader';
import { DEFAULT_SITE_SEO } from '@/src/types/siteConfig';
import ClientStoreApp from '../ClientStoreApp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { siteConfig } = await getServerStoreData();
  const seo = { ...DEFAULT_SITE_SEO, ...(siteConfig.seo || {}) };
  const origin = process.env.APP_URL || 'https://sufantools.vercel.app';
  const canonical = `${origin}/faqs`;
  const portrait = siteConfig.banner?.portraitUrl || 'https://ik.imagekit.io/mrsaqib/image_uuc03rwq7.png';
  const brandOwner = siteConfig.banner?.mainTitle?.trim() || 'Sufan';
  const fullBrand = `${brandOwner} ${siteConfig.banner?.highlightTitle?.trim() || 'Agency Hub'}`.trim();
  const brand = siteConfig.footer?.brandName || fullBrand;

  return {
    title: `Frequently Asked Questions (FAQs) — Help & Support | ${brand}`,
    description:
      `Answers to frequently asked questions about account delivery times, payment methods (EasyPaisa, JazzCash, Banks), wallet top-ups, and warranty policies for ${brand}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `FAQs & Help Desk — ${brand}`,
      description: `Delivery guarantees, payment answers, and customer policies.`,
      url: canonical,
      siteName: brand,
      images: [
        {
          url: seo.ogImageUrl || portrait,
          secureUrl: seo.ogImageUrl || portrait,
          width: 1024,
          height: 1536,
          alt: `FAQs — ${brand}`,
          type: 'image/jpeg',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `FAQs & Help Desk | ${brand}`,
      description: `Delivery guarantees, payment answers, and customer policies.`,
      images: [seo.ogImageUrl || portrait],
    },
  };
}

export default async function FaqsPage() {
  const { services, webTools, siteConfig, reviews } = await getServerStoreData();

  return (
    <main className="min-h-screen">
      <ClientStoreApp
        initialServices={services}
        initialTools={webTools}
        initialConfig={siteConfig}
        initialReviews={reviews}
        initialTab="faqs"
      />
    </main>
  );
}
