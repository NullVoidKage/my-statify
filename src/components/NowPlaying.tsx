import React, { useState } from "react";
import "../style/NowPlaying.scss";

const NowPlaying = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlaying = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  return (
    <div className={`now-playing ${isPlaying ? "playing" : "paused"}`}>
      <span className="bar n1">A</span>
      <span className="bar n2">B</span>
      <span className="bar n3">C</span>
      <span className="bar n4">D</span>
      <span className="bar n5">E</span>
      <span className="bar n6">F</span>
      <span className="bar n7">G</span>
      <span className="bar n8">H</span>
      <span className="bar n9">I</span>
    </div>
  );
};

export default NowPlaying;
