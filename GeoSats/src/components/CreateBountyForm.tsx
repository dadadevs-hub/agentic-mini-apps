
import React, { useState } from 'react';
import { X, MapPin, Zap, Brain, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const CreateBountyForm = ({ isOpen, onClose, onSubmit, userLocation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    difficulty: 'easy',
    location: userLocation || { lat: '', lng: '' },
    puzzle: '',
    useAI: false
  });
  const [isGeneratingPuzzle, setIsGeneratingPuzzle] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.reward) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!formData.location.lat || !formData.location.lng) {
      toast({
        title: "Location Required",
        description: "Please set GPS coordinates for the bounty",
        variant: "destructive"
      });
      return;
    }

    const bountyData = {
      ...formData,
      id: Date.now().toString(),
      reward: parseInt(formData.reward),
      creator: 'anonymous', // In real app, get from Nostr identity
      location: {
        lat: parseFloat(formData.location.lat),
        lng: parseFloat(formData.location.lng)
      }
    };

    onSubmit(bountyData);
    
    toast({
      title: "Bounty Created!",
      description: `${bountyData.title} is now live with ${bountyData.reward} sats reward`,
    });
  };

  const generateAIPuzzle = async () => {
    setIsGeneratingPuzzle(true);
    
    // Simulate AI puzzle generation
    setTimeout(() => {
      const puzzles = [
        "What has four legs in the morning, two legs in the afternoon, and three legs in the evening?",
        "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?",
        "The more you take, the more you leave behind. What am I?",
        "I can be cracked, made, told, and played. What am I?",
        "What begins with T, ends with T, and has T in it?"
      ];
      
      const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      setFormData(prev => ({ ...prev, puzzle: randomPuzzle }));
      setIsGeneratingPuzzle(false);
      
      toast({
        title: "Puzzle Generated!",
        description: "AI has created a puzzle for your bounty",
      });
    }, 2000);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6)
            }
          }));
          toast({
            title: "Location Set",
            description: "Using your current GPS coordinates",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-black/90 border-purple-500/20 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Create New Bounty
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Bounty Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Find the hidden QR code"
                  className="bg-black/60 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what hunters need to do..."
                  className="bg-black/60 border-gray-600 text-white min-h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reward" className="text-white">Reward (sats) *</Label>
                  <Input
                    id="reward"
                    type="number"
                    value={formData.reward}
                    onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
                    placeholder="1000"
                    className="bg-black/60 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="bg-black/60 border-gray-600 text-white">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-600">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white">GPS Location *</Label>
                <Button
                  type="button"
                  onClick={useCurrentLocation}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Use Current Location
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat" className="text-gray-300">Latitude</Label>
                  <Input
                    id="lat"
                    value={formData.location.lat}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, lat: e.target.value }
                    }))}
                    placeholder="37.7749"
                    className="bg-black/60 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="lng" className="text-gray-300">Longitude</Label>
                  <Input
                    id="lng"
                    value={formData.location.lng}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, lng: e.target.value }
                    }))}
                    placeholder="-122.4194"
                    className="bg-black/60 border-gray-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Puzzle Section */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Puzzle Challenge (Optional)</span>
                </Label>
                <Button
                  type="button"
                  onClick={generateAIPuzzle}
                  disabled={isGeneratingPuzzle}
                  variant="outline"
                  size="sm"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                >
                  {isGeneratingPuzzle ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate AI Puzzle
                    </>
                  )}
                </Button>
              </div>

              <Textarea
                value={formData.puzzle}
                onChange={(e) => setFormData(prev => ({ ...prev, puzzle: e.target.value }))}
                placeholder="Add a riddle or puzzle that hunters must solve at the location..."
                className="bg-black/60 border-gray-600 text-white min-h-16"
              />

              {formData.puzzle && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <Badge className="bg-purple-500/20 text-purple-400 mb-2">Puzzle Preview</Badge>
                  <p className="text-sm text-gray-300">{formData.puzzle}</p>
                </div>
              )}
            </CardContent>
          </Card>

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
              type="submit"
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600"
            >
              <Target className="w-4 h-4 mr-2" />
              Create Bounty
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBountyForm;
