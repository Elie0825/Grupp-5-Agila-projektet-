import React, { useState } from "react";
import "../CSS/MarvelUniversum.css";
import CharacterCircle from "./CharacterCircle.tsx";
import "../CSS/CharacterCircle.css";


interface Movie {
  Title: string;
  Year: string;
  Poster: string;
  Genre: string;
  imdbRating: string;
}

interface Character {
  id: number;
  name: string;
  image: string;
  
}

const MarvelUniversum: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | Character | null>(null);

  const characters: Character[] = [
    {
      id: 1,
      name: "Captain America",
      image: "/captain-america-karakter.jpg",
    },
    {
      id: 2,
      name: "Black Widow",
      image: "/black-widow-karaktar.jpg",
    },
    {
      id: 3,
      name: "Black Panther",
      image: "/black-panther-karaktar.jpg",
    },
    {
      id: 4,
      name: "Ant Man",
      image: "/ant-man.jpg",
    },
    {
      id: 5,
      name: "Iron Man",
      image: "/iron-man-karakter.jpg",
    },
    {
      id: 6,
      name: "Captain Marvel",
      image: "",
    },
    {
      id: 7,
      name: "Doctor Strange",
      image: "",
    },
    {
      id: 8,
      name: "Hulk",
      image: "",
    },
    {
      id: 9,
      name: "Nick Fury",
      image: "",
    },
    {
      id: 10,
      name: "Loki",
      image: "",
    },
    {
      id: 11,
      name: "Hawkeye",
      image: "",
    },
    {
      id: 12,
      name: "Spider Man",
      image: "",
    },
    {
      id: 13,
      name: "Star Lord",
      image: "",
    },
    {
      id: 14,
      name: "Scarlet Witch",
      image: "",
    },
    {
      id: 15,
      name: "Thor",
      image: "",
    },
    {
      id: 16,
      name: "Thanos",
      image: "",
    },
    {
      id: 17,
      name: "Vision",
      image: "",
    },
    {
      id: 18,
      name: "Wong",
      image: "",
    },
    {
      id: 19,
      name: "Falcon",
      image: "",
    },
    {
      id: 20,
      name: "",
      image: "",
    },
    // fler karaktärer...
  ];

  const handleCardClick = (movie: Movie | Character) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="marvels-historia">
      {/* Hero-bild */}
      <div className="marvel-hero">
        <img
          src="/hero- header.svg"
          alt="Marvel Cinematic Universe"
          className="hero-image"
        />
      </div>

      {/* Karaktärer */}
      <div className="character-grid">
        {characters.map((char) => (
          <CharacterCircle
            key={char.id}
            name={char.name}
            image={char.image}
            rating={char.rating}
            id={char.id}
            onClick={() => handleCardClick(char)}
          />
        ))}
      </div>

      {/* Popup */}
      {selectedMovie && (
        <div className="popup-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <img
              src={"Poster" in selectedMovie ? selectedMovie.Poster : selectedMovie.image}
              alt={selectedMovie.Title || selectedMovie.name}
              className="popup-image"
            />
            <div className="popup-info">
              <h2>{"Title" in selectedMovie ? selectedMovie.Title : selectedMovie.name}</h2>
              {"Year" in selectedMovie && <p><strong>Year:</strong> {selectedMovie.Year}</p>}
              <p><strong>Rating:</strong> {selectedMovie.imdbRating || selectedMovie.rating}</p>
              {"Genre" in selectedMovie && <p><strong>Genre:</strong> {selectedMovie.Genre}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Laddning / Felmeddelande */}
      {/* {loading && <p>Loading...</p>}
      {error && <p>{error}</p>} */}

      {/* Timeline med filmer — just nu avstängd */}
      {/* 
      <div className="timeline">
        {movies && movies.length > 0 ? (
          movies.map((movie: Movie, index: number) => (
            <div
              className="timeline-event"
              key={index}
              onClick={() => handleCardClick(movie)}
            >
              {movie.Poster ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="movie-image"
                />
              ) : (
                <p>No poster available</p>
              )}
              <div className="movie-info">
                <h2>{movie.Title}</h2>
                <p>{movie.Year}</p>
                <p>Rating: {movie.imdbRating}</p>
                <p>Genre: {movie.Genre}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
      */}
    </div>
  );
};

export default MarvelUniversum;
