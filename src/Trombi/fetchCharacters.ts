import MD5 from 'crypto-js/md5';

export const fetchCharacters = async (offset: number, limit: number, signal: AbortSignal) => {
  const timestamp = new Date().getTime();
  const stringToHash = `${timestamp}${import.meta.env.VITE_MARVEL_API_PRIVATE_KEY}${import.meta.env.VITE_MARVEL_API_PUBLIC_KEY}`;
  const hash = MD5(stringToHash);

  const searchParams = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    hash: hash.toString(),
    ts: timestamp.toString(),
    apikey: import.meta.env.VITE_MARVEL_API_PUBLIC_KEY
  }).toString();

  const response = await fetch(`/api/marvel/characters?${searchParams}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    signal
  });

  return response.json();
};
