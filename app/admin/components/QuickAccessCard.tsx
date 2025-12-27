"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  href: string;
  count?: number;
  countLabel?: string;
}

export function QuickAccessCard({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBgColor,
  href,
  count,
  countLabel,
}: QuickAccessCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {description}
            </p>
            {count !== undefined && (
              <div className="mb-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </span>
                {countLabel && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {countLabel}
                  </span>
                )}
              </div>
            )}
            <Link href={href}>
              <Button variant="ghost" size="sm" className="group">
                Ver más
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
