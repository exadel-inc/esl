export const registerServiceWorker = async () => {
  const {origin} = location;
  if (/localhost/.test(origin) || !navigator.serviceWorker) return;

  navigator.serviceWorker.register(origin + '/serviceWorker.js', {scope: '/'})
    .catch((err) => console.log(err));
};
