const storageKey = "plst-ext";

const getSetting = async (key) => {
  const fullKey = `${storageKey}-${key}`;
  return ((await browser.storage.sync.get(fullKey)) ?? {})[fullKey];
};

const setSetting = (key, value) => {
  const fullKey = `${storageKey}-${key}`;
  const obj = {};
  obj[fullKey] = value;
  browser.storage.sync.set(obj);
};

const update = async () => {
  document.querySelector("#settings-json").textContent = JSON.stringify(
    await browser.storage.sync.get(),
    undefined,
    4
  );
};

document.addEventListener("DOMContentLoaded", async () => {
  const inputBar = document.querySelector("#url-input-bar");
  inputBar.value =
    (await getSetting("url-endpoint")) ?? "http://localhost:8080/playlist/add";
  inputBar.addEventListener("change", async () => {
    setSetting("url-endpoint", inputBar.value);
    update();
  });

  const chooser = document.querySelector("#add-position-chooser");
  chooser.value = (await getSetting("add-position")) ?? "queue-next";
  chooser.addEventListener("change", async () => {
    setSetting("add-position", chooser.value);
    update();
  });

  update();
});
