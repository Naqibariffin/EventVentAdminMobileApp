<template>
  <IonPage>
    <!-- Header -->
    <IonHeader>
      <IonToolbar>
        <IonTitle>Admin Dashboard</IonTitle>
        <IonButton @click="logout" slot="end" fill="clear" color="danger">
          Logout
        </IonButton>
      </IonToolbar>
    </IonHeader>
    <IonContent class="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex items-center justify-center">
  <div class="max-w-2xl w-full bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Welcome, {{ adminName }}!</h2>

    <!-- Dashboard Cards -->
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-white shadow-lg rounded-xl p-6 text-center transition transform hover:scale-105">
        <h3 class="text-lg font-semibold text-gray-700">Total Users</h3>
        <p class="text-3xl font-extrabold text-blue-600 mt-2">{{ userCount }}</p>
      </div>

      <div class="bg-white shadow-lg rounded-xl p-6 text-center transition transform hover:scale-105">
        <h3 class="text-lg font-semibold text-gray-700">Total Events</h3>
        <p class="text-3xl font-extrabold text-green-600 mt-2">{{ eventCount }}</p>
      </div>
    </div>

    <!-- Manage Buttons -->
    <div class="mt-8 space-y-4">
      <IonButton 
        expand="full" 
        class="rounded-full text-lg font-medium shadow-md hover:shadow-lg transition duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        @click="goToUsers"
      >
        Manage Users
      </IonButton>

      <IonButton 
        expand="full" 
        class="rounded-full text-lg font-medium shadow-md hover:shadow-lg transition duration-300 bg-gradient-to-r from-purple-500 to-pink-600 text-white"
        @click="goToEvents"
      >
        Manage Events
      </IonButton>
    </div>
  </div>
</IonContent>
  </IonPage>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
} from "@ionic/vue";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

// Router instance
const router = useRouter();
const auth = getAuth();

// Reactive state
const adminName = ref("Admin");
const userCount = ref(0);
const eventCount = ref(0);

// Fetch user and event counts from Firestore
const loadCounts = async () => {
  try {
    const [usersSnapshot, eventsSnapshot] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "events")),
    ]);

    userCount.value = usersSnapshot.size;
    eventCount.value = eventsSnapshot.size;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Lifecycle hook
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      adminName.value = user.displayName || "Admin";
      loadCounts();
    } else {
      router.replace("/login");
    }
  });
});

// Navigation methods
const goToUsers = () => router.push("/manage-user");
const goToEvents = () => router.push("/manage-event");

// Logout function
const logout = async () => {
  try {
    await signOut(auth);
    router.replace("/home");
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
</script>
