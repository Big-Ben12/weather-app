// Handles Visual Crossing API
export async function fetchWeather(location, unit, apiKey) {
  const unitGroup = unit === 'celsius' ? 'metric' : 'us';
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=${unitGroup}&key=${apiKey}&contentType=json`
  );
  if (!response.ok) throw new Error(`Weather API Error: ${response.status}`);
  return response.json();
}
