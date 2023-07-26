import React from 'react';
import { FiPlayCircle, FiMusic, FiStar, FiClock, FiShare2, FiUser } from 'react-icons/fi';

import '../style/StatifyCard.scss'; // Import your styles

export function StatifyCard() {
  const cardData = [
    {
      title: 'Currently Playing',
      description: 'You can view your currently playing song in realtime.',
      icon: <FiPlayCircle />,
    },
    {
      title: 'My Top Tracks of (all time, six months, 4 weeks)',
      description: 'You can see your top (all time, six months, 4 weeks) tracks since you join Spotify.',
      icon: <FiMusic />,
    },
    {
      title: 'My Top Artists of (all time, six months, 4 weeks)',
      description: 'You can see your top  artist of (all time, six months, 4 weeks).',
      icon: <FiStar />,
    },
    {
      title: 'Recently Played Tracks',
      description: 'You can check your  recently played tracks.',
      icon: <FiClock />,
    },
    {
      title: 'Export Chart to Story',
      description: 'You can export your chart to your social media story.',
      icon: <FiShare2 />,
    },
    {
      title: 'My Music Personality',
      description: 'You can see your Music Personality based on genre what you are listening.',
      icon: <FiUser />,
    },
  ];

  return (
    <div className="spotichart-card">
      {cardData.map((item, index) => (
        <div className="card" key={index}>
          <div className="card-icon">{item.icon}</div>
          <h3 className="card-title">{item.title}</h3>
          <p className="card-description">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

