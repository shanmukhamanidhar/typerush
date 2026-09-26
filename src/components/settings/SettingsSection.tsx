import React from 'react';

interface SettingsSectionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  id,
  title,
  icon,
  children,
}) => {
  return (
    <section id={id} className="pt-6 pb-2 space-y-3 font-mono">
      <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E5] dark:border-[#222222]">
        {icon && <span className="text-[#FF5A00]">{icon}</span>}
        <h2 className="text-sm uppercase tracking-wider font-bold text-[#111111] dark:text-[#F5F5F5]">
          {title}
        </h2>
      </div>
      <div className="divide-y divide-black/[0.03] dark:divide-white/[0.03]">
        {children}
      </div>
    </section>
  );
};
