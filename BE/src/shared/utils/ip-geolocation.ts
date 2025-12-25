import axios from 'axios';

export interface GeoLocationResult {
  full: string;
  country: string;
  city: string;
}

export async function getGeoLocationFromIp(ip: string): Promise<GeoLocationResult> {
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return { full: 'Local', country: 'Local', city: 'Local' };
  }
  try {
    // Using ip-api.com (free, no key required, limited rate)
    const url = `http://ip-api.com/json/${ip}?fields=status,country,city,query`;
    const { data } = await axios.get(url, { timeout: 2000 });
    if (data.status === 'success') {
      return {
        full: `${data.city || 'Unknown'}, ${data.country || 'Unknown'}`,
        country: data.country || 'Unknown',
        city: data.city || 'Unknown',
      };
    }
    return { full: 'Unknown', country: 'Unknown', city: 'Unknown' };
  } catch (e) {
    return { full: 'Unknown', country: 'Unknown', city: 'Unknown' };
  }
}
