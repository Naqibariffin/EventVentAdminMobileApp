<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Manage Users</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="p-4 bg-gray-100">
      <!-- Add User Button -->
      <div class="flex justify-end mx-6 mt-2">
      </div>

      <div v-if="loading" class="text-center text-gray-600">Loading...</div>
      <div v-if="users.length > 0">
        <!-- User List Cards -->
        <div class="mt-4 space-y-3 mx-6">
          <div
            v-for="user in users"
            :key="user.id"
            class="bg-[#074b06] shadow-md rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition">
            <div>
              <h1 class="text-base font-medium text-white">{{ user.name }}</h1>
              <p class="text-sm text-white opacity-80">{{ user.email }}</p>
            </div>
            <div class="flex gap-2">
              <ion-button size="medium" class="text-xs px-3 py-1" style="--background: #0096FF; --color: white;" @click.stop="editUser(user)">Edit</ion-button>
              <ion-button size="medium" class="text-xs px-3 py-1" color="danger" @click.stop="deleteUser(user.id)">Delete</ion-button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="users.length === 0" class="text-center text-sm text-gray-500 mt-4">No users found.</p>
    </ion-content>

    <!-- User Edit Modal -->
    <ion-modal :isOpen="showModal" @didDismiss="closeModal">
      <div class="bg-white p-6 rounded-2xl shadow-xl w-96 mx-auto mt-20 backdrop-blur-md">
        <h3 class="text-xl font-bold text-center mb-4 text-gray-700">✏ Edit User</h3>

        <!-- Name Input -->
        <label class="block text-gray-600 text-left mb-1 font-semibold">Full Name:</label>
        <input 
          v-model="selectedUser.name" 
          type="text" 
          class="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-400 transition-all"
          placeholder="Enter full name"
        />

        <!-- Email Input (Disabled) -->
        <label class="block text-gray-600 text-left mb-1 font-semibold">Email:</label>
        <input 
          v-model="selectedUser.email" 
          type="email" 
          disabled 
          class="w-full border p-2 rounded bg-gray-100 mb-3 cursor-not-allowed"
        />

        <!-- Password Input -->
        <label class="block text-gray-600 text-left mb-1 font-semibold">Password:</label>
        <input 
          v-model="selectedUser.password" 
          type="text" 
          class="w-full border p-2 rounded bg-gray-100 mb-3"
          placeholder="Enter new password"
        />

        <p v-if="updateMessage" class="text-sm text-green-500 animate-pulse">{{ updateMessage }}</p>
        <p v-if="updateError" class="text-sm text-red-500 animate-pulse">{{ updateError }}</p>

        <!-- Buttons -->
        <ion-button expand="full" color="success" @click="updateUser" class="mt-3">
          ✅ Save Changes
        </ion-button>
        
        <ion-button expand="full" color="danger" @click="closeModal" class="mt-2">
          ❌ Cancel
        </ion-button>
      </div>
    </ion-modal>

  </ion-page>
</template>


<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonModal, IonIcon
} from "@ionic/vue";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const users = ref([]);
const showModal = ref(false);
const selectedUser = ref({});
const router = useRouter();

const goToAddUser = () => {
  router.push('/add-user');
};


const loadUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  users.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || "No Name",
    email: doc.data().email || "No Email",
    password: doc.data().password || "" 
  }));
};

// Open modal to edit user
const editUser = (user) => {
  selectedUser.value = { ...user };
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  selectedUser.value = {};
};

// Update user details in Firebase 
const updateUser = async () => {
  try {
    const userRef = doc(db, "users", selectedUser.value.id);

    // Update user name and password in Firestore
    await updateDoc(userRef, {
      name: selectedUser.value.name,
      password: selectedUser.value.password,
    });

    await loadUsers(); 
    closeModal();
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Error updating user. Check console for details.");
  }
};

// Delete user from Firebase
const deleteUser = async (userId) => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await deleteDoc(doc(db, "users", userId));
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
};

// Load users when page is mounted
onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.user-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.user-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
</style>
