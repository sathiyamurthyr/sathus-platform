import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Leadership Team',
  description: 'Meet the executive leadership and advisory team at Sathus Technology.',
  alternates: {
    canonical: '/company/leadership',
  },
  openGraph: {
    title: 'Leadership Team — Sathus Technology',
    description: 'Meet the executive leadership and advisory team at Sathus Technology.',
    url: `${siteConfig.url}/company/leadership`,
  },
};

const leaders = [
  {
    name: 'Sathish Kumar',
    role: 'Chief Executive Officer & Founder',
    bio: 'Pioneered cloud transformation and AI platforms across global banking and health systems for over 18 years.',
    tag: 'Executive',
  },
  {
    name: 'Dr. Anita Roy',
    role: 'Chief Technology Officer',
    bio: 'Former principal AI researcher specializing in multi-agent evaluation harnesses and zero-trust security architecture.',
    tag: 'Engineering',
  },
  {
    name: 'Marcus Vance',
    role: 'Head of Enterprise Solutions',
    bio: 'Architected large-scale datalakes and distributed microservice platforms for Fortune 500 enterprises.',
    tag: 'Solutions',
  },
];

export default function LeadershipPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'Leadership' }]} />
      <SectionIntro
        eyebrow="Leadership"
        title="Guided by Enterprise & Technology Leaders"
        description="Our executive team combines deep engineering domain expertise with decades of experience in regulated industries."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {leaders.map((leader) => (
          <div key={leader.name} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mb-4 uppercase tracking-wider">
                {leader.tag}
              </span>
              <h2 className="text-xl font-bold text-foreground mb-1">{leader.name}</h2>
              <p className="text-xs font-medium text-primary mb-4">{leader.role}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">{leader.bio}</p>
            </div>
            <Link href="/company/contact" className="text-xs font-semibold text-primary hover:underline">
              Contact Leadership →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
