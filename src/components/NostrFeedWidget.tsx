import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { User, Key, MessageSquare, Clock, MapPin } from 'lucide-react';
import { useNostr } from '../hooks/useNostr';

interface NostrEvent {
  id: string;
  content: string;
  created_at: number;
  pubkey: string;
  kind: number;
  tags: string[][];
}

const NostrFeedWidget: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [feed, setFeed] = useState<NostrEvent[]>([]);
  const { isConnected } = useNostr();

  // Mock login function
  const handleLogin = () => {
    if (privateKey.length === 64) {
      // Simulate key validation and public key derivation
      setPublicKey(privateKey.substring(0, 16) + '...');
      setIsLoggedIn(true);
      
      // Mock feed data
      const mockFeed: NostrEvent[] = [
        {
          id: '1',
          content: 'Just discovered an amazing bounty near the Golden Gate Bridge! 🌉',
          created_at: Date.now() - 1800000,
          pubkey: 'user123',
          kind: 1,
          tags: [['t', 'bounty'], ['location', 'san-francisco']]
        },
        {
          id: '2',
          content: 'Successfully claimed a treasure hunt bounty in Central Park! The puzzle was tricky but worth it 💰',
          created_at: Date.now() - 3600000,
          pubkey: 'explorer456',
          kind: 1,
          tags: [['t', 'success'], ['location', 'new-york']]
        },
        {
          id: '3',
          content: 'New bounty created: Find the hidden QR code at the Hollywood Sign viewpoint. 10k sats reward!',
          created_at: Date.now() - 7200000,
          pubkey: 'creator789',
          kind: 30001,
          tags: [['d', 'bounty_3'], ['reward', '10000'], ['location', 'hollywood']]
        }
      ];
      setFeed(mockFeed);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPrivateKey('');
    setPublicKey('');
    setFeed([]);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const getEventIcon = (kind: number) => {
    switch (kind) {
      case 30001:
        return <MapPin className="w-4 h-4 text-primary" />;
      default:
        return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-primary" />
          Nostr Feed
          {isConnected && (
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isLoggedIn ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="privateKey" className="text-sm font-medium">
                Private Key (hex)
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="privateKey"
                  type="password"
                  placeholder="Enter your Nostr private key..."
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleLogin} 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={privateKey.length !== 64}
            >
              Login to Nostr
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Your key is stored locally and never shared
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium">Logged in</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-xs h-7 px-2"
              >
                Logout
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Public Key</Label>
              <div className="text-xs font-mono bg-muted p-2 rounded border truncate">
                {publicKey}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Recent Activity</Label>
              <ScrollArea className="h-64 border rounded-lg bg-background/30">
                <div className="p-3 space-y-3">
                  {feed.map((event) => (
                    <div key={event.id} className="space-y-2 pb-3 border-b border-border/30 last:border-b-0">
                      <div className="flex items-start gap-2">
                        {getEventIcon(event.kind)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-relaxed">
                            {event.content}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground font-mono">
                              {event.pubkey.substring(0, 8)}...
                            </span>
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(event.created_at)}
                            </span>
                          </div>
                          {event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {event.tags.filter(tag => tag[0] === 't').map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs px-1 py-0">
                                  #{tag[1]}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NostrFeedWidget;