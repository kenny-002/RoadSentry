import React from 'react';
import * as LucideIcons from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: keyof typeof LucideIcons;
  color: 'blue' | 'emerald' | 'amber' | 'purple';
}

export default function FeatureCard({ title, description, iconName, color }: FeatureCardProps) {
  const Icon = LucideIcons[iconName] as React.ComponentType<{ className?: string }>;

  const colorConfig = {
    blue: {
      bg: 'bg-slate-100 dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-slate-750 dark:text-slate-300',
      glow: 'glow-blue',
      hover: 'hover:border-slate-350 dark:hover:border-navy-600',
      gradient: 'from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400'
    },
    emerald: {
      bg: 'bg-slate-100 dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-slate-750 dark:text-slate-300',
      glow: 'glow-emerald',
      hover: 'hover:border-slate-350 dark:hover:border-navy-600',
      gradient: 'from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400'
    },
    amber: {
      bg: 'bg-slate-100 dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-slate-750 dark:text-slate-300',
      glow: 'glow-amber',
      hover: 'hover:border-slate-350 dark:hover:border-navy-600',
      gradient: 'from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400'
    },
    purple: {
      bg: 'bg-slate-100 dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-slate-750 dark:text-slate-300',
      glow: 'glow-purple',
      hover: 'hover:border-slate-350 dark:hover:border-navy-600',
      gradient: 'from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400'
    }
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <div className={`glass-panel p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-opacity-40 dark:bg-opacity-20 ${config.hover} hover:bg-opacity-50 dark:hover:bg-opacity-35`}>
      <div className="space-y-4">
        {/* Icon Wrapper */}
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${config.bg} ${config.glow}`}>
          <Icon className="h-6 w-6" />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Learn More link */}
      <div className="pt-4 flex items-center text-xs font-bold bg-gradient-to-r bg-clip-text text-transparent group-hover:underline mt-auto">
        <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
          System Integrated
        </span>
      </div>
    </div>
  );
}
