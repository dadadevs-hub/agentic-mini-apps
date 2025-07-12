
import { useState, useEffect } from 'react';

// Mock Nostr hook for demonstration
export const useNostr = () => {
  const [bounties, setBounties] = useState([
    {
      id: '1',
      title: 'Find the Golden Gate Secret',
      description: 'Locate the hidden plaque near the Golden Gate Bridge and solve the riddle engraved on it.',
      reward: 5000,
      difficulty: 'medium',
      creator: 'explorer123',
      location: { lat: 37.8199, lng: -122.4783 },
      puzzle: 'What connects two cities but touches neither?',
      createdAt: Date.now() - 3600000,
      status: 'active'
    },
    {
      id: '2',
      title: 'Central Park Treasure Hunt',
      description: 'Find the statue of Alice in Wonderland and count the characters around her.',
      reward: 2500,
      difficulty: 'easy',
      creator: 'nyc_wanderer',
      location: { lat: 40.7749, lng: -73.9656 },
      puzzle: 'How many characters surround Alice in this bronze wonderland?',
      createdAt: Date.now() - 7200000,
      status: 'active'
    },
    {
      id: '3',
      title: 'Hollywood Sign Challenge',
      description: 'Get to the best viewpoint of the Hollywood Sign and answer the puzzle.',
      reward: 10000,
      difficulty: 'hard',
      creator: 'la_explorer',
      location: { lat: 34.1341, lng: -118.3215 },
      puzzle: 'In what year was this iconic sign first erected?',
      createdAt: Date.now() - 1800000,
      status: 'active'
    }
  ]);
  
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate Nostr connection
    const timer = setTimeout(() => {
      setIsConnected(true);
      console.log('Connected to Nostr relays');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const publishBounty = (bountyData) => {
    console.log('Publishing bounty to Nostr:', bountyData);
    
    const newBounty = {
      ...bountyData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      status: 'active'
    };
    
    setBounties(prev => [newBounty, ...prev]);
    
    // Simulate Nostr event publishing
    const nostrEvent = {
      kind: 30001, // Custom kind for bounties
      content: JSON.stringify(bountyData),
      tags: [
        ['d', bountyData.id],
        ['location', bountyData.location.lat.toString(), bountyData.location.lng.toString()],
        ['reward', bountyData.reward.toString()]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
    
    console.log('Nostr event:', nostrEvent);
  };

  const claimBounty = (bountyId, claimData) => {
    console.log('Claiming bounty:', bountyId, claimData);
    
    // Simulate claim verification and payout
    setBounties(prev => prev.map(bounty => 
      bounty.id === bountyId 
        ? { ...bounty, status: 'claimed', claimedBy: claimData.claimer }
        : bounty
    ));
    
    // Simulate Nostr claim event
    const claimEvent = {
      kind: 30002, // Custom kind for claims
      content: JSON.stringify(claimData),
      tags: [
        ['e', bountyId], // Reference to bounty event
        ['claim', 'success']
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
    
    console.log('Claim event:', claimEvent);
  };

  return {
    bounties,
    isConnected,
    publishBounty,
    claimBounty
  };
};
