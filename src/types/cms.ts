export interface CmsHero {
  heading: string;
  subheading: string;
  background_image: string;
  cta_label: string;
  cta_link: string;
}

export interface CmsTextSection {
  type: "text";
  content: string;
}

export interface CmsBenefitsItem {
  title: string;
  description: string;
  icon: string;
}

export interface CmsBenefitsSection {
  type: "benefits";
  items: CmsBenefitsItem[];
}

export interface CmsCtaBannerSection {
  type: "cta_banner";
  heading: string;
  subheading: string;
  button_label: string;
  button_link: string;
}

export type CmsSection =
  | CmsTextSection
  | CmsBenefitsSection
  | CmsCtaBannerSection;

export interface CmsPage {
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  hero: CmsHero;
  sections: CmsSection[];
  is_published: boolean;
}
