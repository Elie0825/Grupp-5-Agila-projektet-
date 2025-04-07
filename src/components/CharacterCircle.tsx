import React from "react";

interface CharacterProps {
  id: number;
  name: string;
  image: string;
  rating: number;
  onClick: () => void;
}

const CharacterCircle: React.FC<CharacterProps> = ({ name, image, rating, onClick }) => {
  return (
    <div className="character-circle" onClick={onClick}>
      <img src={image} alt={name} />
      <div className="character-rating">{rating}</div>
      <div className="character-name">{name}</div>
    </div>
  );
};

export default CharacterCircle;
