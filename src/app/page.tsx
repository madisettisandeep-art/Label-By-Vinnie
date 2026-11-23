import React from 'react';
import { BrandIntro } from '@/components/layout/BrandIntro';
import { CinematicFashionHero } from '@/components/hero/CinematicFashionHero';
import { CollectionsSection } from '@/components/collections/CollectionsSection';
import { FeaturedProducts } from '@/components/products/FeaturedProducts';
import { CustomStitchingStudio } from '@/components/stitching/CustomStitchingStudio';
import { BrandStory } from '@/components/story/BrandStory';
import { InstagramSection } from '@/components/story/InstagramSection';

export default function HomePage() {
  return (
    <>
      <BrandIntro />
      <CinematicFashionHero />
      <CollectionsSection />
      <FeaturedProducts />
      <CustomStitchingStudio />
      <BrandStory />
      <InstagramSection />
    </>
  );
}
