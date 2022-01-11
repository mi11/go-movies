export interface IMovie {
  id: string;
  title: string;
  description: string;
  year: number | null;
  release_date: Date | null;
  runtime: number | null;
  rating: number | null;
  mpaa_rating: string;
  genres: { [id: number]: string };
}
