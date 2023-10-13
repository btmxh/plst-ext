browser.runtime.onMessage.addListener(async (msg) => {
  try {
    console.debug('wtf');
    if("osugame" in msg) {
      const url = msg.endpoint;
      const pos = msg.position;

      const json = JSON.parse(document.getElementById('json-beatmapset').text);

      const query = `${json.artist_unicode} - ${json.title_unicode}`;
      const addUrl = `yt.be/search:${query}`;
      const body = `position=${pos}&url=${addUrl}`;

      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      if(r.status != 200) {
        throw new Error(`unable to add url: '${addUrl}'`);
      }
    }
  } catch (e) {
    alert(e);
  }
});
