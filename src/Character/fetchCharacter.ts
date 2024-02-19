import MD5 from 'crypto-js/md5';

export const fetchCharacter = async (id: string) => {
  const timestamp = new Date().getTime();
  const stringToHash = `${timestamp}${import.meta.env.VITE_MARVEL_API_PRIVATE_KEY}${import.meta.env.VITE_MARVEL_API_PUBLIC_KEY}`;
  const hash = MD5(stringToHash);

  const searchParams = new URLSearchParams({
    hash: hash.toString(),
    ts: timestamp.toString(),
    apikey: import.meta.env.VITE_MARVEL_API_PUBLIC_KEY
  }).toString();

  const response = await fetch(`/api/marvel/characters/${id}?${searchParams}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
