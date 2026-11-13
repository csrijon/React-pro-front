// Motorcycle photography (Unsplash CDN). Swap for your own CDN/assets any time.
const PHOTOS = {
  ducati: '1568772585407-9361f9bf3a87',
  roadRider: '1558980664-10e7170b5df9',
  sunsetRider: '1558981806-ec527fa84c39',
  cruiser: '1558980394-0a06c4631733',
  enfield: '1622185135505-2d795003994a',
  ktm: '1449426468159-d96dbf08f19f',
  yamaha: '1547549082-6bc09f2049ae',
  harley: '1558981285-6f0c94958bb6',
  naked: '1591637333184-19aa84b3e01f',
  kawasaki: '1580310614729-ccd69652491d',
  ninja: '1599819811279-d5ad9cccf838',
  r6: '1609630875171-b1321377ee65',
  garage: '1530046339160-ce3e530c7d2f',
  livewire: '1558981403-c5f9899a28bc',
}

export const photo = (key, w = 1200) =>
  `https://images.unsplash.com/photo-${PHOTOS[key]}?auto=format&fit=crop&w=${w}&q=75`
export const PHOTO_KEYS = Object.keys(PHOTOS)

/** srcset for an Unsplash photo: the CDN resizes on the fly, so phones download a fraction of the desktop bytes. */
export const photoSrcSet = (key, max = 1600) => {
  const widths = [...new Set([...[400, 800, 1200, 1600, 2000].filter((w) => w < max), max])]
  return widths.map((w) => `${photo(key, w)} ${w}w`).join(', ')
}
