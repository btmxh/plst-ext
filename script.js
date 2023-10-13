const storageKey = "plst-ext";
const getSetting = async (key) => {
  const fullKey = `${storageKey}-${key}`;
  return ((await browser.storage.sync.get(fullKey)) ?? {})[fullKey];
};

browser.contextMenus.create({
  id: "plst-open-link",
  title: "Open link in plst",
  contexts: ["link"],
});
browser.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "plst-open-link") {
    const url = info.linkUrl;
    const body = `position=${
      (await getSetting("add-position")) ?? "queue-next"
    }&url=${encodeURIComponent(url)}`;

    const response = await fetch(
      (await getSetting("url-endpoint")) ??
        "http://localhost:8080/playlist/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );
    if (response.status !== 200) {
      browser.tabs.executeScript({
        code: `alert("unable to play url: " + "${url}")`,
      });
    }
  }
});

browser.contextMenus.create({
  id: "plst-open-osu",
  title: "Add osugame song to plst (search title youtube)",
  contexts: ["all"],
  documentUrlPatterns: ["*://osu.ppy.sh/*"]
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "plst-open-osu") {
    browser.tabs.sendMessage(tab.id, {
      osugame: true,
      endpoint:   
      (await getSetting("url-endpoint")) ??
        "http://localhost:8080/playlist/add",
    position: 
      (await getSetting("add-position")) ?? "queue-next"
    });
  }
});
