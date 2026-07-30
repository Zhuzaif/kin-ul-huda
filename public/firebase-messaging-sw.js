importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyChBwgg01Z1iUae46LQ05BXy_is2Vg-oLg",
  authDomain: "women-app-72ede.firebaseapp.com",
  projectId: "women-app-72ede",
  storageBucket: "women-app-72ede.firebasestorage.app",
  messagingSenderId: "341548834022",
  appId: "1:341548834022:web:8565957dd0c1f8135cef27"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/vite.svg',
    image: payload.notification?.image || payload.notification?.imageUrl,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetScreen = event.notification.data?.screen || '';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Focus the open window if exists and send message
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if ('focus' in client) {
          client.postMessage({ type: 'NAVIGATE', screen: targetScreen });
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/?screen=' + targetScreen);
      }
    })
  );
});
