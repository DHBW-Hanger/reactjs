const userInput = 'Berlin';

/**
 * wikipedia Api Call for everything
 *
 * @param {float} longitude
 * @param {float} latitude
 *
 */
async function wikiCall(longitude = 9.44376, latitude = 47.667223) {

  // Functions

  // reverseGeocoding returns a json object. Within the key address are country, city and more.
  const location = await reverseGeocoding(longitude, latitude);
  console.log(location);

  const city = userInput;
  // city = location['address']['city'];
  const info = await townInfo(city);
  console.log(info);

  const images = await getImages(userInput);
  console.log(images);

  /**
   * prints address on console
   *
   * @param {float} lon
   * @param {float} lat
   * @return {Promise<void>}
   */
  async function reverseGeocoding(lon, lat) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}`);
    const data = await response.json();
    return (data);
  }

  /**
   * returns the first extract in wikipedia about the location and removes all html elements and brackets
   * since the pageid changes from every apicall, the first key in the dictionary data['query']['pages] is collected
   *
   * @param {string} location
   * @return {string} data
   */
  async function townInfo(location) {
    const url = `https://de.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=${location}&format=json&origin=*`;
    let data = await getContent(url);
    try {
      data = data['query']['pages'];
      // gets first key from data
      let [id] = Object.keys(data);
      data = data[id]['extract'];
      data = data.replace(/<[^>]+>/g, '');
      // removes everything between square brackets, however some wikipedia articles look bad then.
      data = data.replace(/ *\[[^\]]*]/g, '');
      // removes everything between normal brackets.
      data = data.replace(/\(.*?\)/g, '');
    } catch {
    }
    return data;
  }

  /**
   * prints urls of images on console
   *
   * @param {string} location
   * @return {string} urls of images
   */
  async function getImages(location) {
    // get names of images at location
    const locationurl = `https://de.wikipedia.org/w/api.php?action=query&titles=${location}&format=json&prop=images&imlimit=10&origin=*`;
    const imageNames = await getContent(locationurl);

    // create urls for image api Call
    const apiurls = await createImageAPIUrls(imageNames);

    let contentImageApi;
    const content = [];
    // get image urls
    try {
      for (let i = 0; i < apiurls.length; i++) {
        contentImageApi = await getContent(apiurls[i]);
        if ('imageinfo' in contentImageApi['query']['pages'][0]) {
          if ('url' in contentImageApi['query']['pages'][0]['imageinfo'][0]) {
            content.push(contentImageApi['query']['pages'][0]['imageinfo'][0]['url']);
          }
        } else {
          content.push('');
        }
      }
    } catch {
    }
    return content;
  }

  /**
   * creates the url apicalls for the imagenames and only includes the .jpg files
   * @param {json} data
   * @return {string} urls
   */
  async function createImageAPIUrls(data) {
    const pageId = Object.keys(data.query.pages)[0];
    const images = data.query.pages[pageId]['images'];
    const urls = [];
    let count = 0;
    for (let i = 0; i < images.length; i++) {
      if ((images[i]['title']).includes('.jpg') && (count < 2)) {
        let imagename = images[i]['title'];
        imagename = imagename.replace('Datei', 'File');
        urls[count] = `https://de.wikipedia.org/w/api.php?action=query&titles=${imagename}&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=url&format=json&formatversion=2&origin=*`;
        count++;
      }
    }
    return urls;
  }

  /**
   * fetches the url and returns the content
   * @param {string} url
   * @return {json} content
   */
  async function getContent(url) {
    let content;
    await fetch(
        url,
        {
          method: 'GET',
        },
    )
        .then((response) => response.json())
        .then((json) => content = json)
        .catch((error) => {
          console.log(error.message);
        });
    return content;
  }
}

export default wikiCall();
