<template>
  <ion-page>
    <ion-content fullscreen class="flex items-center justify-center bg-gradient-to-br from-green-900 to-green-700">
      <ion-grid class="h-screen flex items-center justify-center">
        <ion-row class="w-full flex justify-center">
          <ion-col size="12" size-md="6" size-lg="4" class="flex justify-center">
            <div class="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
              <h2 class="text-3xl font-bold text-green-700 mb-6">Admin Login</h2>

              <ion-item class="w-full mb-4 border-b border-gray-300">
                <ion-label position="floating" class="text-gray-600">Email</ion-label>
                <br>
                <ion-input v-model="email" type="email" class="p-2 w-full"></ion-input>
              </ion-item>

              <ion-item class="w-full mb-4 border-b border-gray-300">
                <ion-label position="floating" class="text-gray-600">Password</ion-label>
                <br>
                <ion-input v-model="password" type="password" class="p-2 w-full"></ion-input>
              </ion-item>

              <p v-if="errorMessage" class="text-red-500 text-sm text-center mb-3">{{ errorMessage }}</p>

              <ion-button expand="full" class="mt-4 text-white font-semibold text-lg py-3 rounded-xl transition duration-300 ease-in-out"
                style="--background: linear-gradient(to right, #0f5c0f, #074b06); border: none;" 
                @click="loginUser" 
                :disabled="loading">
                <span v-if="!loading">Login</span>
                <span v-else>Logging in...</span>
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs, getFirestore } from "firebase/firestore";
import { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel, toastController } from "@ionic/vue";

export default {
  components: { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      loading: false,
    };
  },
  mounted() {
    // Auto-login: Check if the user is already authenticated and is an admin
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getFirestore();
        const q = query(collection(db, "admin"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // If user is admin, redirect to dashboard
          this.$router.push("/dashboard");
        }
      }
    });
  },
  methods: {
    async loginUser() {
      this.errorMessage = "";
      if (!this.email || !this.password) {
        this.showToast("❌ Please enter both email and password!", "danger");
        return;
      }

      try {
        this.loading = true;

        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        const db = getFirestore();
        const q = query(collection(db, "admin"), where("email", "==", this.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          await this.showToast("✅ Admin login successful!", "success");
          setTimeout(() => {
            this.$router.push("/dashboard");
          }, 500);
        } else {
          await auth.signOut();
          this.errorMessage = "Access denied. This account is not an admin.";
          this.showToast("❌ " + this.errorMessage, "danger");
        }
      } catch (error) {
        this.handleFirebaseError(error);
      } finally {
        this.loading = false;
      }
    },

    async showToast(message, color) {
      const toast = await toastController.create({
        message,
        duration: 2000,
        position: "top",
        color,
      });
      toast.present();
    },

    handleFirebaseError(error) {
      const errorCode = error.code;

      if (errorCode === "auth/user-not-found") {
        this.errorMessage = "User not found. Please check your email!";
      } else if (errorCode === "auth/wrong-password") {
        this.errorMessage = "Incorrect password! Please try again.";
      } else if (errorCode === "auth/invalid-email") {
        this.errorMessage = "Invalid email format! Please check the email address.";
      } else if (errorCode === "auth/too-many-requests") {
        this.errorMessage = "Too many login attempts. Please try again later.";
      } else if (errorCode === "auth/network-request-failed") {
        this.errorMessage = "Network error. Please check your internet connection.";
      } else {
        this.errorMessage = "Wrong Password or Username";
      }

      this.showToast("❌ " + this.errorMessage, "danger");
    },
  },
};
</script>
