// Centralized Official Sathus Technology Company Configuration

export interface CompanyAddress {
  street: string;
  landmark: string;
  locality: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formatted: string;
}

export interface CompanySocials {
  linkedin: string;
  instagram: string;
  github?: string;
  twitter?: string;
}

export interface CompanyConfig {
  name: string;
  shortName: string;
  legalName: string;
  address: CompanyAddress;
  email: string;
  phone: string;
  phoneRaw: string;
  website: string;
  socials: CompanySocials;
  getOrganizationSchema: () => object;
  getLocalBusinessSchema: () => object;
  getContactPointSchema: () => object;
}

export const companyConfig: CompanyConfig = {
  name: 'Sathus Technology Pvt. Ltd.',
  shortName: 'Sathus Technology',
  legalName: 'Sathus Technology Pvt. Ltd.',
  address: {
    street: 'Plot No. 8/47, Sri Ambal Nagar Annexe, Ponni Amman Kovil St',
    landmark: 'Opp. Kedar Hospital',
    locality: 'Kovur',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '600128',
    country: 'India',
    formatted:
      'Plot No. 8/47, Sri Ambal Nagar Annexe, Ponni Amman Kovil St, Opp. Kedar Hospital, Kovur, Chennai – 600128, India',
  },
  email: 'admin@sathus.in',
  phone: '+91 90253 81316',
  phoneRaw: '+919025381316',
  website: 'https://www.sathus.in',
  socials: {
    linkedin: 'https://www.linkedin.com/in/sathus-technology-b81801332',
    instagram: 'https://www.instagram.com/sathus.technology/',
  },
  getOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://www.sathus.in/#organization',
      name: this.name,
      legalName: this.legalName,
      alternateName: ['Sathus', 'Sathus Technology', 'Sathus.in', 'Sathus Platform'],
      url: this.website,
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.sathus.in/icon.svg',
        width: '512',
        height: '512',
      },
      image: 'https://www.sathus.in/icon.svg',
      email: this.email,
      telephone: this.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${this.address.street}, ${this.address.landmark}`,
        addressLocality: this.address.locality,
        addressRegion: this.address.state,
        postalCode: this.address.postalCode,
        addressCountry: 'IN',
      },
      knowsAbout: [
        'AI Engineering',
        'Enterprise Data Lakehouse',
        'Cloud Modernization',
        'Agentic AI Systems',
        'Model Context Protocol',
        'FastAPI MLOps',
        'Enterprise Software Architecture',
      ],
      sameAs: [this.socials.linkedin, this.socials.instagram],
    };
  },
  getLocalBusinessSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': 'https://www.sathus.in/#localbusiness',
      name: this.name,
      image: 'https://www.sathus.in/icon.svg',
      url: this.website,
      telephone: this.phone,
      email: this.email,
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${this.address.street}, ${this.address.landmark}`,
        addressLocality: this.address.locality,
        addressRegion: this.address.state,
        postalCode: this.address.postalCode,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '13.0118',
        longitude: '80.1256',
      },
    };
  },
  getContactPointSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPoint',
      telephone: this.phone,
      contactType: 'customer service',
      email: this.email,
      availableLanguage: ['English', 'Tamil'],
    };
  },
};
