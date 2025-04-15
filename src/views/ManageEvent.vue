<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Manage Events</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="p-4">
      <div v-if="loading" class="text-center">Loading...</div>
      <!-- Current Events -->
      <br>
      <div v-if="currentEvents.length > 0">
        <div class="bg-[#074b06] text-white px-6 py-2 rounded-lg mx-6">
          <h2 class="text-xl font-bold">Current Events</h2>
        </div>
        <div class="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="event in currentEvents" :key="event.id" class="event-card bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            <img :src="event.banner_url" alt="Event Banner" class="w-full h-48 object-cover" />
            <div style="background-color: #074b06;" class="p-4">
              <h1 class="text-lg font-bold text-white text-center">{{ event.event_name }}</h1>
              <p class="text-sm text-gray-100 text-center">{{ event.short_desc }}</p>
              <div class="text-left">
                <p class="text-sm text-gray-200 mt-1">Location: <br />{{ event.location }}</p>
                <p class="text-sm text-gray-200 mt-1">Date: <br />
                  {{ formatDateTime(event.start_date) }}<br> until <br> {{ formatDateTime(event.end_date) }}
                </p>
              </div>
              <br>
                <ion-button expand="block" style="--background: #EDE8D0; --color: black;" @click="openEventModal(event)">See More</ion-button>
                <br>
                <div class="flex gap-4 w-full">
                  <ion-button class="flex-1" style="--background: #0096FF; --color: white;" @click.stop="editEvent(event)">Edit</ion-button>
                  <ion-button class="flex-1" color="danger" @click.stop="deleteEvent(event.id)">Delete</ion-button>
                </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Past Events -->
      <div v-if="pastEvents.length > 0">
        <br>
        <div class="bg-[#074b06] text-white px-4 py-2 rounded-lg mx-4">
          <h2 class="text-xl font-bold">Past Events</h2>
        </div>
        <div class="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="event in pastEvents" :key="event.id" class="event-card bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            <img :src="event.banner_url" alt="Event Banner" class="w-full h-48 object-cover grayscale" />
            <div style="background-color: #3a3a3a;" class="p-4">
              <h1 class="text-lg font-bold text-white text-center">{{ event.event_name }}</h1>
              <p class="text-sm text-gray-100 text-center">{{ event.short_desc }}</p>
              <div class="text-left">
                <p class="text-sm text-gray-300 mt-1">Location: <br />{{ event.location }}</p>
                <p class="text-sm text-gray-300 mt-1">Date:<br />
                  {{ formatDateTime(event.start_date) }}<br> until <br> {{ formatDateTime(event.end_date) }}
                </p>
              </div>
              <br>
              <ion-button expand="block" style="--background: #EDE8D0; --color:black;" @click="openEventModal(event)"> See More </ion-button>
              <br>
              <ion-button expand="block" color="danger" @click.stop="deleteEvent(event.id)">Delete</ion-button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="events.length === 0" class="text-center text-sm text-gray-500">No events found.</p>
    </ion-content>

    <!-- Event Details Modal -->
    <ion-modal :is-open="showModal" @didDismiss="closeModal">
  <ion-header>
    <ion-toolbar>
      <ion-title style="font-weight: bold; background-color: #64af6a; color: #162718;">Event Details</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="p-4">
    <br>
    <div class="mx-4">
      <div class="relative w-full">
      <!-- Event Category (Top-Left Over Banner) -->
      <div class="absolute top-2 left-2 px-4 py-2 rounded-lg text-white font-bold shadow-md" style="background-color: #074b06;">
        {{ selectedEvent.category }}
      </div>
      
      <!-- Event Banner -->
      <img :src="selectedEvent.banner_url" class="w-full h-56 object-cover rounded-lg" v-if="selectedEvent.banner_url" />
    </div>

    <!-- Event Name -->
    <div class="bg-white p-4 mt-4 rounded-xl shadow-md text-center">
      <h2 class="text-2xl font-bold text-black">{{ selectedEvent.event_name }}</h2>
    </div>

    <!-- Short Description -->
    <div class="bg-white p-4 mt-4 rounded-xl shadow-md text-center">
      <p class="text-lg font-semibold text-black">{{ selectedEvent.short_desc }}</p>
    </div>

    <!-- Long Description -->
    <div class="bg-white p-4 mt-4 rounded-xl shadow-md text-center">
      <p class="text-black" style="white-space: pre-line;">{{ selectedEvent.long_desc }}</p>
    </div>

    <!-- Event Info -->
    <div class="bg-white p-4 mt-4 rounded-xl shadow-md text-left">
      <p class="text-sm text-black">📍 Location:<br> <span class="font-semibold">{{ selectedEvent.location }}</span></p>
      <p class="text-sm text-black mt-2">🕒 Start:<br> <span class="font-semibold">{{ formatDateTime(selectedEvent.start_date) }}</span></p>
      <p class="text-sm text-black mt-2">⏳ End:<br> <span class="font-semibold">{{ formatDateTime(selectedEvent.end_date) }}</span></p>
      <p v-if="selectedEvent.enable_rsvp" class="text-sm text-black mt-2">🎟️ Limited For:<br> <span class="font-semibold">{{ selectedEvent.slots }} People Only</span></p>
    </div>

      <ion-button expand="block" style="--background: #b91c1c; --color: white;" @click="closeModal" class="mt-4">
        Close
      </ion-button>
    </div>
    <br>
  </ion-content>
</ion-modal>

<ion-modal :is-open="showRSVPModal" @didDismiss="closeRSVPModal">
  <ion-header>
    <ion-toolbar>
      <ion-title style="font-weight: bold;">
        RSVP List
      </ion-title>
    </ion-toolbar>
  </ion-header>
</ion-modal>

  </ion-page>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
} from "@ionic/vue";
import { collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";

const router = useRouter(); // Import router

const auth = getAuth();
const events = ref([]);
const currentEvents = ref([]);
const pastEvents = ref([]);
const showModal = ref(false);
const selectedEvent = ref({});
const rsvps = ref([]);
const showRSVPModal = ref(false);
const selectedEventRSVPs = ref([]);

const openRSVPModal = async (eventId) => {
  showRSVPModal.value = true;
  selectedEventRSVPs.value = [];

  // Fetch RSVPs for the selected event
  const q = query(collection(db, "rsvps"), where("event_id", "==", eventId));
  const snapshot = await getDocs(q);
  selectedEventRSVPs.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const closeRSVPModal = () => {
  showRSVPModal.value = false;
};

const openEventModal = (event) => {
  selectedEvent.value = event;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedEvent.value = {};
};

const loadEvents = async () => {
  const snapshot = await getDocs(collection(db, "events"));
  events.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Split events into current and past
  const now = new Date();
  currentEvents.value = events.value.filter((event) => new Date(event.end_date) >= now);
  pastEvents.value = events.value.filter((event) => new Date(event.end_date) < now);
};

const deleteEvent = async (eventId) => {
  if (confirm("Are you sure you want to delete this event?")) {
    await deleteDoc(doc(db, "events", eventId));
    loadEvents();
  }
};

const editEvent = (event) => {
  router.push(`/edit-event/${event.id}`); 
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

onMounted(() => {
  loadEvents();
  deleteExpiredEvents();
});

const deleteExpiredEvents = async () => {
  const now = new Date();
  const oneMonthsAgo = new Date();
  oneMonthsAgo.setMonth(now.getMonth() - 1);

  pastEvents.value.forEach((event) => {
    if (new Date(event.end_date) < oneMonthsAgo) {
      deleteEvent(event.id);
    }
  });
};
</script>

<style scoped>
.event-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.event-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
</style>
