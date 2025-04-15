<template>
  <ion-page>
    <ion-content class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 p-4">
      <div class="flex items-center justify-center w-full h-full">
        <!-- Admin Profile Card -->
        <div v-if="admin" class="bg-white bg-opacity-80 p-6 rounded-2xl shadow-2xl w-80 text-center backdrop-blur-md transform transition-transform hover:scale-105">
          <img 
            :src="admin.photoURL || defaultProfilePic" 
            alt="Profile Picture" 
            class="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-300 shadow-lg object-cover transition-all hover:border-purple-400" 
          />

          <h2 class="text-2xl font-bold text-gray-700 mb-2">{{ admin.displayName || "Admin" }}</h2>
          <p class="text-sm text-gray-500 mb-4">{{ admin.email || "No email available" }}</p>

          <p v-if="message" class="text-sm text-green-500 animate-pulse">{{ message }}</p>
          <p v-if="error" class="text-sm text-red-500 animate-pulse">{{ error }}</p>

          <ion-button expand="full" color="primary" class="mt-3" @click="showSettingsModal = true">⚙ Settings</ion-button>
          <ion-button expand="full" color="danger" class="mt-2" @click="logoutAdmin">Logout</ion-button>
          <p class="text-sm text-gray-600 mt-4">
                Have A Questions ? <router-link to="/support" class="text-green-700 font-semibold"><br>FAQ </router-link></p>
        </div>
        
        <div v-else class="text-center text-gray-700 text-lg animate-bounce">Loading profile...</div>
      </div>
      
      <!-- Profile Update Modal -->
      <ion-modal :isOpen="showSettingsModal" @didDismiss="showSettingsModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Update Profile</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showSettingsModal = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        
        <ion-content class="p-6">
          <div class="bg-white p-6 rounded-2xl shadow-xl w-96 mx-auto mt-10">
            <h3 class="text-xl font-bold text-center mb-4 text-gray-700">Update Profile</h3>
            
            <div class="flex flex-col items-center">
              <img 
                :src="previewImage || admin?.photoURL || defaultProfilePic" 
                class="w-28 h-28 rounded-full border-4 border-blue-300 shadow-lg object-cover mb-3"
              />
            </div>
            
            <label class="block text-gray-600 mb-1 font-semibold">Profile Picture:</label>
            <input type="file" @change="handleProfilePicture" class="w-full text-sm mb-3 border p-2 rounded" />
            
            <label class="block text-gray-600 mb-1 font-semibold">New Username:</label>
            <input v-model="newUsername" class="w-full border p-2 rounded mb-3" placeholder="Enter new username" />
            
            <label class="block text-gray-600 mb-1 font-semibold">New Password:</label>
            <input type="password" v-model="newPassword" class="w-full border p-2 rounded mb-3" placeholder="Enter new password" />

            <br>
            <p v-if="updateMessage" class="text-sm text-green-500 animate-pulse">{{ updateMessage }}</p>
            <p v-if="updateError" class="text-sm text-red-500 animate-pulse">{{ updateError }}</p>
            
            <br>
            <ion-button expand="full" color="success" @click="updateAdminProfile">✅ Update</ion-button>
            <br>
            <ion-button expand="full" color="danger" @click="showSettingsModal = false">❌ Cancel</ion-button>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { 
  IonPage, IonContent, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons 
} from "@ionic/vue";
import { 
  getAuth, signOut, onAuthStateChanged, updateProfile 
} from "firebase/auth";
import { ref, onMounted, watch } from "vue";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "vue-router";
import { getFirestore, collection, query, where, getDocs, updateDoc } from "firebase/firestore";


export default {
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
  },
  setup() {
    const auth = getAuth();
    const storage = getStorage();
    const router = useRouter(); // ✅ Use Vue Router instead of window.location
    const admin = ref(null);
    const message = ref("");
    const error = ref("");
    const defaultProfilePic = "https://via.placeholder.com/100";
    const showSettingsModal = ref(false);
    const previewImage = ref(null);
    const selectedFile = ref(null);
    const newUsername = ref("");
    const updateMessage = ref("");
    const updateError = ref("");
    const db = getFirestore();
    const newPassword = ref("");


    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          admin.value = { ...currentUser };
        }
      });
    });

    watch(admin, (newAdmin) => {
      if (!newAdmin) return;
      newUsername.value = newAdmin.displayName || "";
    });

    const handleProfilePicture = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
        previewImage.value = URL.createObjectURL(file);
      }
    };

    const updateAdminPassword = async (newPassword) => {
  try {
    const q = query(collection(db, "admin"), where("email", "==", "admin@gmail.com"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0];
      await updateDoc(adminDoc.ref, { password: newPassword });
      updateMessage.value = "✅ Password updated successfully!";
    } else {
      updateError.value = "❌ Admin not found in database.";
    }
  } catch (err) {
    updateError.value = "❌ Failed to update password: " + err.message;
  }
};


    const uploadProfilePicture = async () => {
      if (!selectedFile.value) return;

      const storagePath = `profile_pictures/${auth.currentUser.uid}`;
      const fileRef = storageRef(storage, storagePath);

      try {
        await uploadBytes(fileRef, selectedFile.value);
        const downloadURL = await getDownloadURL(fileRef);

        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        admin.value.photoURL = downloadURL;
        updateMessage.value = "✅ Profile picture updated successfully!";
      } catch (err) {
        updateError.value = "❌ Failed to update profile picture.";
      }
    };

    const updateAdminProfile = async () => {
      updateMessage.value = "";
      updateError.value = "";

      try {
        if (selectedFile.value) {
          await uploadProfilePicture();
        }

        if (newUsername.value.trim() && newUsername.value !== admin.value.displayName) {
          await updateProfile(auth.currentUser, { displayName: newUsername.value });
          admin.value.displayName = newUsername.value;
        }

        if (newPassword.value.trim()) {
          await updateAdminPassword(newPassword.value.trim());
        }


        updateMessage.value = "✅ Profile updated successfully!";
        setTimeout(() => {
          showSettingsModal.value = false;
        }, 1500);
      } catch (err) {
        updateError.value = "❌ Failed to update profile: " + err.message;
      }
    };

    const logoutAdmin = async () => {
      try {
        await signOut(auth);
        router.push("/home");
      } catch (err) {
        console.error("Logout failed:", err);
        error.value = "❌ Logout failed!";
      }
    };

    return {
      admin,
      handleProfilePicture,
      logoutAdmin,
      message,
      error,
      defaultProfilePic,
      showSettingsModal,
      previewImage,
      newUsername,
      updateAdminProfile,
      updateMessage,
      updateError,
      newPassword,
      updateAdminPassword,
    };
  },
};
</script>
