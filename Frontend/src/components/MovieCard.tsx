import React from 'react';

interface Movie {
    id: number;
    name: string;
    posterUrl: string;
    rating: number;
}

interface MovieCardProps {
    movie: Movie | null;
    onSwipe: (direction: 'left' | 'right') => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSwipe }) => {
    if (!movie) return <div>No more movies available</div>;

    return (
        <div className="movie-card">
            <img src={movie.posterUrl} alt={movie.name} />
            <h3>{movie.name}</h3>
            <p>Rating: {movie.rating}</p>
            <button onClick={() => onSwipe('left')}>Dislike</button>
            <button onClick={() => onSwipe('right')}>Like</button>
        </div>
    );
};

export default MovieCard;
