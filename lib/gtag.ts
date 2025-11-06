// lib/gtag.js
export const GA_MEASUREMENT_ID: string = "G-JEGMSYX4DR";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Log page views
export interface Pageview {
  (url: string): void;
}
export const pageview: Pageview = (url: string): void => {
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Log specific events
export interface EventParams {
  action: string;
  category?: string;
  label?: string;
  value?: number | string;
}
export interface EventFunction {
  (params: EventParams): void;
}
export const event: EventFunction = ({
  action,
  category,
  label,
  value,
}: EventParams): void => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
