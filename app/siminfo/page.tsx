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
  const canonical = `${origin}/siminfo`;
  const portrait = siteConfig.banner?.portraitUrl || 'https://ik.imagekit.io/mrsaqib/image_uuc03rwq7.png';
  const brandOwner = siteConfig.banner?.mainTitle?.trim() || 'Sufan';
  const fullBrand = `${brandOwner} ${siteConfig.banner?.highlightTitle?.trim() || 'Agency Hub'}`.trim();
  const brand = siteConfig.footer?.brandName || fullBrand;

  return {
    title: `SIM Info & Telecommunication Records Lookup | ${brand}`,
    description:
      `Franchise SIM ownership search, NADRA family tree verification, and telecommunication network lookup tools by ${brandOwner}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `SIM Info & Telecommunication Records — ${brand}`,
      description: `Official SIM Database & franchise network lookup service.`,
      url: canonical,
      siteName: brand,
      images: [
        {
          url: seo.ogImageUrl || portrait,
          secureUrl: seo.ogImageUrl || portrait,
          width: 1024,
          height: 1536,
          alt: `SIM Info Records — ${brand}`,
          type: 'image/jpeg',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `SIM Info & Telecommunication Records | ${brand}`,
      description: `Official SIM Database & franchise network lookup service.`,
      images: [seo.ogImageUrl || portrait],
    },
  };
}

export default async function SimInfoPage() {
  const { services, webTools, siteConfig, reviews } = await getServerStoreData();

  return (
    <main className="min-h-screen">
      <ClientStoreApp
        initialServices={services}
        initialTools={webTools}
        initialConfig={siteConfig}
        initialReviews={reviews}
        initialTab="siminfo"
      />
    </main>
  );
}
