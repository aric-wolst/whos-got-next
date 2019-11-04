/*
 *                            Region Calculation module
 *
 * Given a radial distance in km, this module is responsible for returning a square
 * region defined in terms of geographical coordinates (longitude & latitude)
 *
 * Formula for calculating a destination point given a distance and bearing from
 * the start point is given here: https://www.movable-type.co.uk/scripts/latlong.html
 */

const radiusOfEarth = 6371;

// Convert the given number from degrees to radians.
function toRadians(num) {
    let ans = num *(Math.PI/180);
    return ans;
}

// Convert the given number from radians to degree.
function toDegrees(num) {
    let ans = num * (180/Math.PI);
    return ans;
}

// Calculate the latitude of a point given a starting latitude, distance, and bearing.
function calcLat(sLat, dist, bearing) {
    let ans = toDegrees(Math.asin(Math.sin(sLat)*Math.cos(dist/radiusOfEarth)
        + Math.cos(sLat)*Math.sin(dist/radiusOfEarth)*Math.cos(bearing)));

    return ans;
}

// Calculate the longitude of a point given a starting point, distance, bearing, and point latitude.
function calcLon(sLon, sLat, dist, bearing, pLat) {
    let ans = toDegrees(sLon + Math.atan2(Math.sin(bearing)*Math.sin(dist/radiusOfEarth)*Math.cos(sLat),
        Math.cos(dist/radiusOfEarth)-Math.sin(sLat)*Math.sin(toRadians(pLat))));

    return ans;
}

/*
 * Define a square region around a given point using the given distance (km)
 * Returns a JSON object with North, East, South and West region boundaries.
 */
function defineRegion(longitude, latitude, distance) {

    // Define the north, east, west, and south bearings.
    const northBearing = 0;
    const eastBearing = toRadians(90);
    const southBearing = toRadians(180);
    const westBearing = toRadians(270);

    // Convert given longitude and latitude to radians.
    let lon = toRadians(longitude);
    let lat = toRadians(latitude);

    // Calculate the north boundary point.
    let northLat = calcLat(lat, distance, northBearing);

    // Calculate the east boundary point.
    let eastLat = calcLat(lat, distance, eastBearing);
    let eastLon = calcLon(lon, lat, distance, eastBearing, eastLat);

    // Calculate the south boundary point.
    let southLat = calcLat(lat, distance, southBearing);

    // Calculate the west boundary point.
    let westLat = calcLat(lat, distance, westBearing);
    let westLon = calcLon(lon, lat, distance, westBearing, westLat);

    let region = { n : northLat, e : eastLon, s : southLat, w : westLon };

    return region;
}

module.exports = defineRegion;
