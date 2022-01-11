package models

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

type DBModel struct {
	DB *sql.DB
}

// GetOneMovie returns one movie and error, if any
func (m *DBModel) GetOneMovie(id int) (*Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		select 
			id, title, description, year, release_date, rating, runtime, mpaa_rating, created_at, updated_at
		from
			movies
		where
			id = $1	
	`

	row := m.DB.QueryRowContext(ctx, query, id)
	var movie Movie
	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.Description,
		&movie.Year,
		&movie.ReleaseDate,
		&movie.Rating,
		&movie.Runtime,
		&movie.MPAARating,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	movieGenres, err := m.getMovieGenre(id)
	if err != nil {
		return nil, err
	}
	movie.MovieGenre = *movieGenres

	return &movie, nil
}

// GetAllMovies returns all movies and error, if any
func (m *DBModel) GetAllMovies(genreIDs ...int) ([]*Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	where := ""
	if len(genreIDs) > 0 {
		where = fmt.Sprintf(`where id in (
				select 
					movie_id 
				from 
					movies_genres 
				where 
					genre_id = %d)
		`, genreIDs[0])
	}

	query := fmt.Sprintf(`
		select 
			id, title, description, year, release_date, rating, runtime, mpaa_rating, created_at, updated_at
		from
			movies
		%s
		order by
			title
	`, where)

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*Movie
	for rows.Next() {
		var movie Movie
		err = rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.Description,
			&movie.Year,
			&movie.ReleaseDate,
			&movie.Rating,
			&movie.Runtime,
			&movie.MPAARating,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		movieGenres, err := m.getMovieGenre(movie.ID)
		if err != nil {
			return nil, err
		}
		movie.MovieGenre = *movieGenres
		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *DBModel) getMovieGenre(movieID int) (*map[int]string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	genreQuery := `
			select
				mg.id, mg.movie_id, mg.genre_id, g.genre_name 
			from
				movies_genres mg
				left join genres g on g.id = mg.genre_id
			where
				mg.movie_id = $1
		`

	rows, err := m.DB.QueryContext(ctx, genreQuery, movieID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	movieGenres := make(map[int]string)
	for rows.Next() {
		var mg MovieGenre
		err = rows.Scan(
			&mg.ID,
			&mg.MovieID,
			&mg.GenreID,
			&mg.Genre.GenreName,
		)
		if err != nil {
			return nil, err
		}
		movieGenres[mg.ID] = mg.Genre.GenreName
	}

	return &movieGenres, nil
}

func (m *DBModel) GetAllGenres() ([]*Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		select 
			id, genre_name, created_at, updated_at
		from 
			genres
		order by 
			genre_name
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*Genre
	for rows.Next() {
		var genre Genre
		err = rows.Scan(
			&genre.ID,
			&genre.GenreName,
			&genre.CreatedAt,
			&genre.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, &genre)
	}

	return genres, nil
}

func (m *DBModel) InsertMovie(movie Movie) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := `
		insert into movies (title, description, year, release_date, runtime, rating, mpaa_rating, created_at, updated_at)
		values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`

	_, err := m.DB.ExecContext(ctx, stmt,
		movie.Title,
		movie.Description,
		movie.Year,
		movie.ReleaseDate,
		movie.Runtime,
		movie.Rating,
		movie.MPAARating,
		movie.CreatedAt,
		movie.UpdatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}

func (m *DBModel) UpdateMovie(movie Movie) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := `
		update 
		    movies 
		set 
		    title = $1, 
		    description = $2, 
		    year = $3, 
		    release_date = $4, 
		    runtime = $5, 
		    rating = $6, 
		    mpaa_rating = $7, 
		    updated_at = $8
		where 
		    id = $9
	`

	_, err := m.DB.ExecContext(ctx, stmt,
		movie.Title,
		movie.Description,
		movie.Year,
		movie.ReleaseDate,
		movie.Runtime,
		movie.Rating,
		movie.MPAARating,
		movie.UpdatedAt,
		movie.ID,
	)
	if err != nil {
		return err
	}

	return nil
}

func (m *DBModel) DeleteMovie(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := `
		delete from movies
		where id = $1
	`

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	return nil
}
