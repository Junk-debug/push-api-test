const PUBLIC_KEY =
  "BOu5VTUrO47dGGsXL81DLVQUo8KeAr9teIb9M8zwiXoBt9sQgzPEJg0VDyV68AzH-XEHZb-ox5uU9TA3vg7v9II";
const PRIVATE_KEY = "iZ6tbNuoft_8_772WN5Em8CNJIXjYNMZiE0IonCOXMU";

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// saveSubscription saves the subscription to the backend
const saveSubscription = async (subscription) => {
  const SERVER_URL = "http://localhost:4000/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};

self.addEventListener("activate", async () => {
  console.log("activated");
  // This will be called only once when the service worker is activated.
  try {
    const applicationServerKey = urlB64ToUint8Array(PUBLIC_KEY);
    const subscription = await self.registration.pushManager.subscribe({
      applicationServerKey,
      userVisibleOnly: true,
    });
    console.log(subscription);

    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (err) {
    console.error("Error", err);
  }
});

const showLocalNotification = (title, body, swRegistration) => {
  swRegistration.showNotification(title, { body });
};

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
    showLocalNotification("Yolo", event.data.text(), self.registration);
  } else {
    console.log("Push event but no data");
  }
});
