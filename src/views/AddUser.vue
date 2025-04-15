<template>
    <ion-page>
      <ion-content fullscreen class="flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
        <ion-grid class="h-screen flex items-center justify-center">
          <ion-row class="w-full flex justify-center">
            <ion-col size="12" size-md="6" size-lg="4" class="flex justify-center">
              <div class="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
                <h2 class="text-3xl font-bold text-#074b06-700 mb-6">Add New User</h2>
  
                <ion-item class="w-full mb-4 border-b border-gray-300">
                  <ion-label position="floating" class="text-gray-600">Full Name</ion-label>
                  <br>
                  <ion-input v-model="name" class="p-2 w-full"></ion-input>
                </ion-item>
  
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
  
                <ion-button expand="full" class="mt-4 text-white font-semibold text-lg py-2 rounded-xl transition duration-300 ease-in-out"
                  style="--background: linear-gradient(to right, #0f5c0f, #074b06); border: none;" 
                  @click="registerUser" 
                  :disabled="loading">
                  <span v-if="!loading">Add User</span>
                  <span v-else>Adding...</span>
                </ion-button>
  
                <p class="text-sm text-gray-600 mt-4">
                  <router-link to="/manage-user" class="text-blue-700 font-semibold">Back</router-link>
                </p>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
  
        <!-- Toast for Success or Error -->
        <ion-toast 
          :isOpen="showToast" 
          :message="toastMessage" 
          :duration="2000" 
          :color="toastColor" 
          position = "top"
          @didDismiss="showToast = false">
        </ion-toast>
  
      </ion-content>
    </ion-page>
</template>
  
  <script>
  import { auth, db } from "../firebase";
  import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
  import { setDoc, doc } from "firebase/firestore";
  import { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonToast } from "@ionic/vue";
  
  export default {
    components: { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonToast },
    data() {
      return {
        name: "",
        email: "",
        password: "",
        errorMessage: "",
        loading: false,
        showToast: false,
        toastMessage: "",
        toastColor: "success",
      };
    },
    methods: {
      async registerUser() {
        this.errorMessage = "";
        if (!this.name || !this.email || !this.password) {
          this.errorMessage = "All fields are required!";
          this.presentToast("Error: All fields are required!", "danger");
          return;
        }
  
        if (this.password.length < 6) {
          this.errorMessage = "Password must be at least 6 characters!";
          this.presentToast("Error: Password must be at least 6 characters!", "danger");
          return;
        }
  
        try {
          this.loading = true;
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;
  
          await updateProfile(user, { displayName: this.name });
  
          await setDoc(doc(db, "users", user.uid), {
            name: this.name,
            email: this.email,
            role: "user", 
            createdAt: new Date(),
          });
  
          this.presentToast("User added successfully!", "success");
          this.$router.push("/manage-user");
        } catch (error) {
          this.handleFirebaseError(error);
        } finally {
          this.loading = false;
        }
      },
      handleFirebaseError(error) {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          this.errorMessage = "This email is already registered!";
          this.presentToast("Error: This email is already registered!", "danger");
        } else if (errorCode === "auth/invalid-email") {
          this.errorMessage = "Invalid email format!";
          this.presentToast("Error: Invalid email format!", "danger");
        } else if (errorCode === "auth/weak-password") {
          this.errorMessage = "Weak password! Use at least 6 characters.";
          this.presentToast("Error: Weak password! Use at least 6 characters.", "danger");
        } else {
          this.errorMessage = "Error: " + error.message;
          this.presentToast("Error: " + error.message, "danger");
        }
      },
      presentToast(message, color) {
        this.toastMessage = message;
        this.toastColor = color;
        this.showToast = true;
      }
    },
  };
  </script>
  