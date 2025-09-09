import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Heart, 
  Coffee, 
  Sun, 
  Moon,
  Sparkles,
  Camera,
  Calendar,
  Brain
} from "lucide-react";

interface FortuneCardProps {
  type: 'tarot' | 'coffee' | 'horoscope' | 'dream';
  title: string;
  description: string;
  href: string;
  badge: string;
  badgeIcon: any;
}

const iconMap = {
  tarot: Heart,
  coffee: Coffee,
  horoscope: Sun,
  dream: Moon
};

const gradientMap = {
  tarot: 'from-primary to-secondary',
  coffee: 'from-accent to-primary',
  horoscope: 'from-secondary to-accent',
  dream: 'from-primary to-accent'
};

export function FortuneCard({ type, title, description, href, badge, badgeIcon: BadgeIcon }: FortuneCardProps) {
  const Icon = iconMap[type];
  const gradient = gradientMap[type];

  return (
    <Link href={href}>
      <Card className="group relative card-gradient p-6 border border-border hover-lift transition-all duration-300 cursor-pointer">
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient.replace('to', 'via-transparent to')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        <div className="relative z-10">
          <div className="text-center mb-4">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl`}>
              <Icon className="text-primary-foreground w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2" data-testid={`title-${type}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`description-${type}`}>
              {description}
            </p>
          </div>
          
          <div className="text-center">
            <Badge variant="secondary" className="text-xs font-medium">
              <BadgeIcon className="w-3 h-3 mr-1" />
              {badge}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}
