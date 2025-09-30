'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartBar as BarChart3, Users, Link as LinkIcon, Gift, Bot, Settings, Music, TrendingUp } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Channels', href: '/channels', icon: LinkIcon },
  { name: 'Audiences', href: '/audiences', icon: Users },
  { name: 'Offers', href: '/offers', icon: Gift },
  { name: 'Bot', href: '/bot', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Music className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-xl font-bold text-white">Artist Growth Hub</h1>
            <p className="text-sm text-gray-400">Fendi Frost Inc.</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white border-r-2 border-purple-400'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}