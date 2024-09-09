// File: utils/getIpLocation.js
import axios from "axios";

const getIpLocation = async (ip) => {
  try {
    const response = await axios.get(
      `https://tools.iplocation.net/user-agent?ip=${ip}`
    );
    if (response.data && response.data.ip && response.data.country) {
      return {
        ip: response.data.ip,
        city: response.data.city || "Unknown",
        region: response.data.region || "Unknown",
        country: response.data.country || "Unknown",
        lat: response.data.lat || "Unknown",
        lon: response.data.lon || "Unknown",
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting IP location:", error);
    return null;
  }
};

export default getIpLocation;
