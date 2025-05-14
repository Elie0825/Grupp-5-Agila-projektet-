import React, { useState } from 'react';
import { Movie } from '../types/movie';
import { fetchMarvelMovies } from '../services/api';
import MovieCard from './MovieCard';
import '../css/RandomMovieKnapp.css';


const RandomMovie: React.FC<{ onMovieClick?: (movie: Movie) => void }> = ({ onMovieClick }) => {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);

  const getRandomMovie = async () => {
    const movies = await fetchMarvelMovies();
    const random = movies[Math.floor(Math.random() * movies.length)];
    setRandomMovie(random);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={getRandomMovie} className="random-button">
        🎲 Hämta Slumpmässig Film
      </button>

      {randomMovie && (
        <div style={{ marginTop: '1rem' }}>
          <MovieCard movie={randomMovie} onClick={function (movie: Movie): void {
                      throw new Error('Function not implemented.');
                  } }  />
        </div>
      )}
    </div>
  );
};

export default RandomMovie;
