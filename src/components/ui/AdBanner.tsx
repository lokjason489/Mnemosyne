import type React from 'react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

interface AdBannerProps {
  adClient?: string;
  adSlot?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  showLabel?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  adClient = 'ca-pub-6995811232744511',
  adSlot,
  adFormat = 'horizontal',
  fullWidthResponsive = false,
  className,
  showLabel = false,
}) => {
  const { t } = useTranslation();
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Avoid duplicate push in React StrictMode
    if (isPushed.current) return;

    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // Only push if the ins tag hasn't already been processed by Google AdSense
        const status = adRef.current.getAttribute('data-adsbygoogle-status');
        if (!status) {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          isPushed.current = true;
        }
      }
    } catch (err) {
      console.debug('AdSense push error or blocked by ad blocker:', err);
    }
  }, []);

  return (
    <div
      className={cn(
        'w-full max-w-lg rounded-xl liquid-glass-subtle px-2.5 py-1 text-center overflow-hidden flex flex-col items-center justify-center relative min-h-11.5 max-h-16',
        className
      )}
    >
      {showLabel && (
        <div className="w-full flex items-center justify-center gap-1.5 mb-0.5 select-none">
          <span className="h-px w-4 bg-slate-300 dark:bg-white/10" />
          <span className="text-[8px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            {t('advertisement', 'ADVERTISEMENT')}
          </span>
          <span className="h-px w-4 bg-slate-300 dark:bg-white/10" />
        </div>
      )}

      <div className="w-full overflow-hidden flex items-center justify-center min-h-9.5 max-h-12">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: 'inline-block', width: '100%', height: '46px', maxHeight: '48px' }}
          data-ad-client={adClient}
          {...(adSlot ? { 'data-ad-slot': adSlot } : {})}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};

export default AdBanner;
