// Handles Giphy API
export async function fetchGif(query, giphyKey) {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${encodeURIComponent(query)}&limit=1`
  );
  if (!response.ok) throw new Error('Giphy Error');
  const data = await response.json();
  if (!data.data.length) return null;
  return data.data[0].images.fixed_height.url;
}
