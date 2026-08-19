// Thin analytics wrapper — keeps component code decoupled from the Vercel package.
// Usage: import { trackEvent } from '@/lib/analytics';
//        trackEvent('case_study_viewed', { slug: 'koji-ai-chief-of-staff' });

import { track } from '@vercel/analytics';

type EventName =
  | 'case_study_viewed'
  | 'constellation_node_clicked'
  | 'constellation_tech_filter_applied'
  | 'resume_opened'
  | 'contact_form_submitted'
  | 'availability_badge_clicked';

export function trackEvent(name: EventName, props?: Record<string, string | number | boolean>) {
  try {
    track(name, props);
  } catch {
    // Silently ignore — analytics must never break the UI
  }
}
