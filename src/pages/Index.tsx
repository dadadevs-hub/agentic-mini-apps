
import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Trophy, Plus, Compass, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BountyMap from '@/components/BountyMap';
import CreateBountyForm from '@/components/CreateBountyForm';
import BountyFeed from '@/components/BountyFeed';
import ClaimBountyModal from '@/components/ClaimBountyModal';
import NostrFeedWidget from '@/components/NostrFeedWidget';
import { useNostr } from '@/hooks/useNostr';
import { useLightning } from '@/hooks/useLightning';
import { useLocation } from '@/hooks/useLocation';

const Index = () => {
  const [activeView, setActiveView] = useState('map');
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  
  const { bounties, isConnected: nostrConnected, publishBounty, claimBounty } = useNostr();
  const { isConnected: lightningConnected, balance } = useLightning();
  const { location, requestLocation } = useLocation();

  useEffect(() => {
    // Request location on app load
    requestLocation();
  }, []);

  const handleCreateBounty = (bountyData) => {
    publishBounty({
      ...bountyData,
      location: location || { lat: 0, lng: 0 },
      createdAt: Date.now(),
      status: 'active'
    });
    setShowCreateForm(false);
  };

  const handleClaimBounty = (bounty) => {
    setSelectedBounty(bounty);
    setShowClaimModal(true);
  };

  const activeBounties = bounties.filter(b => b.status === 'active');
  const nearbyBounties = location ? activeBounties.filter(b => {
    const distance = calculateDistance(location, b.location);
    return distance <= 10; // 10km radius
  }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                <Compass className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  GEOSATS
                </h1>
                <p className="text-xs text-gray-400">GPS Bounty Hunter</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${nostrConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-gray-300">Nostr</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${lightningConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-gray-300">⚡ {balance || 0} sats</span>
              </div>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Bounty
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/10 backdrop-blur-md border-b border-purple-500/10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'map', label: 'Map', icon: MapPin },
              { id: 'feed', label: 'Feed', icon: Trophy },
              { id: 'nearby', label: 'Nearby', icon: Compass }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all ${
                  activeView === id
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {id === 'nearby' && nearbyBounties.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-yellow-400/20 text-yellow-400">
                    {nearbyBounties.length}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active Bounties"
            value={activeBounties.length}
            icon={Trophy}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Total Rewards"
            value={`${activeBounties.reduce((sum, b) => sum + b.reward, 0)} sats`}
            icon={Zap}
            gradient="from-yellow-500 to-orange-500"
          />
          <StatCard
            title="Nearby"
            value={nearbyBounties.length}
            icon={Compass}
            gradient="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Your Location"
            value={location ? "📍 Found" : "🔍 Searching"}
            icon={MapPin}
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        {/* Content based on active view */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {activeView === 'map' && (
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                  <span>Bounty Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <BountyMap
                  bounties={activeBounties}
                  userLocation={location}
                  onBountyClick={handleClaimBounty}
                />
              </CardContent>
            </Card>
          )}

          {activeView === 'feed' && (
            <BountyFeed
              bounties={activeBounties}
              userLocation={location}
              onClaimBounty={handleClaimBounty}
            />
          )}

          {activeView === 'nearby' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Nearby Bounties</h2>
              {nearbyBounties.length > 0 ? (
                <BountyFeed
                  bounties={nearbyBounties}
                  userLocation={location}
                  onClaimBounty={handleClaimBounty}
                />
              ) : (
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md">
                  <CardContent className="text-center py-12">
                    <Compass className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Nearby Bounties</h3>
                    <p className="text-gray-400">
                      {location ? "No bounties within 10km of your location" : "Enable location to find nearby bounties"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          </div>
          
          {/* Nostr Feed Widget */}
          <div className="hidden lg:block">
            <NostrFeedWidget />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCreateForm && (
        <CreateBountyForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateBounty}
          userLocation={location}
        />
      )}

      {showClaimModal && selectedBounty && (
        <ClaimBountyModal
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          bounty={selectedBounty}
          userLocation={location}
          onClaim={(claimData) => {
            claimBounty(selectedBounty.id, claimData);
            setShowClaimModal(false);
          }}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md hover:bg-black/50 transition-all">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`bg-gradient-to-r ${gradient} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Helper function to calculate distance between two coordinates
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

export default Index;
