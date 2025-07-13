
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Target, Zap } from 'lucide-react';

const BountyMap = ({ bounties, userLocation, onBountyClick }) => {
  const mapRef = useRef(null);
  const [selectedBounty, setSelectedBounty] = useState(null);

  // Mock map component since we can't use external map libraries in this demo
  useEffect(() => {
    console.log('Map initialized with bounties:', bounties);
    console.log('User location:', userLocation);
  }, [bounties, userLocation]);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20">
        <div className="w-full h-full bg-grid-pattern opacity-10"></div>
      </div>

      {/* User Location Indicator */}
      {userLocation && (
        <div 
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: '50%',
            top: '50%'
          }}
        >
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-30"></div>
          </div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Your Location
          </div>
        </div>
      )}

      {/* Bounty Markers */}
      {bounties.map((bounty, index) => {
        const left = 20 + (index * 15) % 60; // Spread bounties across the map
        const top = 20 + (index * 20) % 60;
        
        return (
          <div
            key={bounty.id}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: `${left}%`,
              top: `${top}%`
            }}
            onClick={() => {
              setSelectedBounty(bounty);
              onBountyClick(bounty);
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <div className="absolute inset-0 w-8 h-8 bg-yellow-400 rounded-full animate-pulse opacity-20"></div>
            </div>
            
            {/* Bounty Preview */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg min-w-32 text-center backdrop-blur-md border border-yellow-400/20">
              <div className="font-semibold truncate">{bounty.title}</div>
              <div className="text-yellow-400">{bounty.reward} sats</div>
            </div>
          </div>
        );
      })}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-30 space-y-2">
        <button className="bg-black/80 text-white p-2 rounded-lg backdrop-blur-md border border-white/20 hover:bg-black/90 transition-colors">
          <Target className="w-4 h-4" />
        </button>
        <button 
          className="bg-black/80 text-white p-2 rounded-lg backdrop-blur-md border border-white/20 hover:bg-black/90 transition-colors"
          onClick={() => console.log('Center on user location')}
        >
          <MapPin className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-md border border-white/20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>You</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            <span>Bounties</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BountyMap;
