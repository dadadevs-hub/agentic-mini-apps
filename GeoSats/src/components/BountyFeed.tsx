
import React from 'react';
import { MapPin, Clock, Zap, User, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BountyFeed = ({ bounties, userLocation, onClaimBounty }) => {
  const formatDistance = (bountyLocation) => {
    if (!userLocation) return "Location unknown";
    
    const distance = calculateDistance(userLocation, bountyLocation);
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  if (bounties.length === 0) {
    return (
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md">
        <CardContent className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Active Bounties</h3>
          <p className="text-gray-400">Be the first to create a bounty in this area!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bounties.map((bounty) => (
        <Card key={bounty.id} className="bg-black/40 border-purple-500/20 backdrop-blur-md hover:bg-black/50 transition-all group">
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {bounty.title}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{bounty.creator}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(bounty.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{formatDistance(bounty.location)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>{bounty.reward} sats</span>
                </div>
                <Badge variant="secondary" className={`
                  ${bounty.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : ''}
                  ${bounty.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                  ${bounty.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : ''}
                `}>
                  {bounty.difficulty}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">{bounty.description}</p>
            
            {bounty.puzzle && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
                <h4 className="text-purple-400 font-semibold mb-1">Puzzle Challenge</h4>
                <p className="text-sm text-gray-300">{bounty.puzzle}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>GPS: {bounty.location.lat.toFixed(4)}, {bounty.location.lng.toFixed(4)}</span>
                {bounty.claimCount && (
                  <span>{bounty.claimCount} attempts</span>
                )}
              </div>
              <Button
                onClick={() => onClaimBounty(bounty)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                Claim Bounty
              </Button>
            </div>

            {/* Progress Bar for Distance */}
            {userLocation && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Distance</span>
                  <span>{formatDistance(bounty.location)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.max(10, Math.min(100, 100 - (calculateDistance(userLocation, bounty.location) * 10)))}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper function to calculate distance
const calculateDistance = (pos1, pos2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
  const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default BountyFeed;
