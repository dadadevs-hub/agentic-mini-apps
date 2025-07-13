
import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Brain, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ClaimBountyModal = ({ isOpen, onClose, bounty, userLocation, onClaim }) => {
  const [claimData, setClaimData] = useState({
    puzzleAnswer: '',
    currentLocation: null
  });
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [distance, setDistance] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userLocation && bounty.location) {
      const dist = calculateDistance(userLocation, bounty.location);
      setDistance(dist);
      setIsWithinRange(dist <= 0.1); // Within 100 meters
    }
  }, [userLocation, bounty.location]);

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setClaimData(prev => ({ ...prev, currentLocation: newLocation }));
          
          const dist = calculateDistance(newLocation, bounty.location);
          setDistance(dist);
          setIsWithinRange(dist <= 0.1);
          
          toast({
            title: "Location Updated",
            description: `You are ${dist < 1 ? Math.round(dist * 1000) + 'm' : dist.toFixed(1) + 'km'} from the bounty`,
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isWithinRange) {
      toast({
        title: "Too Far Away",
        description: "You must be within 100m of the bounty location to claim it",
        variant: "destructive"
      });
      return;
    }

    if (bounty.puzzle && !claimData.puzzleAnswer.trim()) {
      toast({
        title: "Puzzle Required",
        description: "Please solve the puzzle to claim this bounty",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate claim processing
    setTimeout(() => {
      const claimPayload = {
        bountyId: bounty.id,
        claimer: 'anonymous', // In real app, get from Nostr identity  
        location: claimData.currentLocation || userLocation,
        puzzleAnswer: claimData.puzzleAnswer,
        timestamp: Date.now()
      };

      onClaim(claimPayload);
      setIsProcessing(false);
      
      toast({
        title: "Bounty Claimed!",
        description: `Congratulations! You've earned ${bounty.reward} sats`,
      });
      
      onClose();
    }, 2000);
  };

  const formatDistance = (dist) => {
    if (dist < 1) {
      return `${Math.round(dist * 1000)}m`;
    }
    return `${dist.toFixed(1)}km`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-black/90 border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
            <Target className="w-6 h-6 text-yellow-400" />
            <span>Claim Bounty</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bounty Info */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold text-white mb-2">{bounty.title}</h3>
              <p className="text-gray-300 mb-4">{bounty.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                    <Zap className="w-3 h-3 mr-1" />
                    {bounty.reward} sats
                  </Badge>
                  <Badge variant="secondary" className={`
                    ${bounty.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : ''}
                    ${bounty.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    ${bounty.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : ''}
                  `}>
                    {bounty.difficulty}
                  </Badge>
                </div>
                <div className="text-sm text-gray-400">
                  by {bounty.creator}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Check */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-white flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Location Verification</span>
                </Label>
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:text-white"
                >
                  Update Location
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Bounty Location:</span>
                  <span className="text-white">
                    {bounty.location.lat.toFixed(4)}, {bounty.location.lng.toFixed(4)}
                  </span>
                </div>
                
                {distance !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Your Distance:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">{formatDistance(distance)}</span>
                      {isWithinRange ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                )}

                <div className={`p-3 rounded-lg border ${
                  isWithinRange 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {isWithinRange ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>You are within claiming range!</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>You must be within 100m to claim this bounty</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Puzzle Section */}
          {bounty.puzzle && (
            <Card className="bg-black/40 border-purple-500/20">
              <CardContent className="p-4">
                <Label className="text-white flex items-center space-x-2 mb-3">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Solve the Puzzle</span>
                </Label>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
                  <p className="text-purple-300">{bounty.puzzle}</p>
                </div>

                <Input
                  value={claimData.puzzleAnswer}
                  onChange={(e) => setClaimData(prev => ({ ...prev, puzzleAnswer: e.target.value }))}
                  placeholder="Enter your answer..."
                  className="bg-black/60 border-gray-600 text-white"
                />
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isWithinRange || isProcessing}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white disabled:opacity-50"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Claim {bounty.reward} sats
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimBountyModal;
