import type { BlogPost, DSAPattern } from '../types';

const BASE_URL = 'https://corelearnly.com';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CoreLearnly',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    description:
      'Learn DSA, System Design (LLD & HLD), and AI fundamentals through live online classes with personal mentorship.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@corelearnly.com',
      contactType: 'customer support',
    },
    sameAs: [
      'https://www.instagram.com/corelearnly',
      'https://www.linkedin.com/company/corelearnly',
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CoreLearnly',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildCourseSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'DSA, System Design & AI Fundamentals — 6 Month Live Program',
    description:
      'Master Data Structures & Algorithms, Low Level Design, High Level Design, and AI fundamentals through live online classes with personal mentorship.',
    provider: {
      '@type': 'Organization',
      name: 'CoreLearnly',
      url: BASE_URL,
    },
    instructor: {
      '@type': 'Person',
      name: 'Ganesh Patil',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'P6M',
      instructor: {
        '@type': 'Person',
        name: 'Ganesh Patil',
      },
    },
    offers: {
      '@type': 'Offer',
      price: '2000',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/apply`,
    },
    syllabusSections: [
      {
        '@type': 'Syllabus',
        name: 'Data Structures & Algorithms',
        description:
          'Core data structures, algorithm design and analysis, problem-solving techniques, interview-focused practice',
      },
      {
        '@type': 'Syllabus',
        name: 'Low Level Design (LLD)',
        description:
          'Object-oriented design principles, design patterns, component-level architecture',
      },
      {
        '@type': 'Syllabus',
        name: 'High Level Design (HLD)',
        description:
          'Scalable system architecture, distributed systems, real-world case studies (Uber, Netflix, etc.)',
      },
      {
        '@type': 'Syllabus',
        name: 'AI Fundamentals',
        description:
          'Basic AI concepts, AI tools for productivity, practical AI applications for developers',
      },
    ],
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildBlogPostingSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CoreLearnly',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.svg`,
      },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    url: `${BASE_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
    ...(post.cover_image_url && { image: post.cover_image_url }),
    ...(post.tags.length > 0 && { keywords: post.tags.join(', ') }),
    timeRequired: `PT${post.read_time_minutes}M`,
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildPatternSchema(pattern: DSAPattern) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pattern.title,
    description: pattern.excerpt,
    author: {
      '@type': 'Person',
      name: pattern.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CoreLearnly',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.svg`,
      },
    },
    datePublished: pattern.published_at || pattern.created_at,
    dateModified: pattern.updated_at,
    url: `${BASE_URL}/patterns/${pattern.slug}`,
    mainEntityOfPage: `${BASE_URL}/patterns/${pattern.slug}`,
    ...(pattern.cover_image_url && { image: pattern.cover_image_url }),
    ...(pattern.tags.length > 0 && { keywords: pattern.tags.join(', ') }),
    timeRequired: `PT${pattern.read_time_minutes}M`,
    proficiencyLevel: pattern.difficulty === 'easy' ? 'Beginner' : pattern.difficulty === 'medium' ? 'Intermediate' : 'Advanced',
  };
}

export function buildPatternListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'DSA Pattern Library',
    description: 'Curated collection of Data Structures & Algorithms patterns for interview preparation.',
    url: `${BASE_URL}/patterns`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'CoreLearnly',
      url: BASE_URL,
    },
  };
}
