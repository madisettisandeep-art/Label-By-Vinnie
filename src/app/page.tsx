import React from 'react';
import { BrandIntro } from '@/components/layout/BrandIntro';
import { CampaignHeroCarousel } from '@/components/hero/CampaignHeroCarousel';
import { CollectionsSection } from '@/components/collections/CollectionsSection';
import { FeaturedProducts } from '@/components/products/FeaturedProducts';
import { CustomStitchingStudio } from '@/components/stitching/CustomStitchingStudio';
import { BrandStory } from '@/components/story/BrandStory';
import { InstagramSection } from '@/components/story/InstagramSection';

export default function HomePage() {
  return (
    <>
      <BrandIntro />
      <CampaignHeroCarousel />
      <CollectionsSection />
      <FeaturedProducts />
      <CustomStitchingStudio />
      <BrandStory />
      <InstagramSection />
    </>
  );
}
