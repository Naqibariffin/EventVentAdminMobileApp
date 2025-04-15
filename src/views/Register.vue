<template>
    <IonPage>
      <IonContent class="flex items-center justify-center h-screen">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h1 class="text-xl font-bold text-center mb-4">Admin Register</h1>
  
          <form @submit.prevent="register">
            <IonInput v-model="name" type="text" placeholder="Full Name" class="w-full mb-3 p-2 border rounded"></IonInput>
            <IonInput v-model="email" type="email" placeholder="Email" class="w-full mb-3 p-2 border rounded"></IonInput>
            <IonInput v-model="password" type="password" placeholder="Password" class="w-full mb-3 p-2 border rounded"></IonInput>
            <IonButton expand="full" type="submit">Register</IonButton>
          </form>
  
          <p v-if="errorMessage" class="text-red-500 mt-3 text-center">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-green-500 mt-3 text-center">{{ successMessage }}</p>
        </div>
      </IonContent>
    </IonPage>
</template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { IonPage, IonContent, IonButton, IonInput } from "@ionic/vue";
  import { auth, createUserWithEmailAndPassword, db, doc, setDoc } from "../firebase";
  
  const name = ref("");
  const email = ref("");
  const password = ref("");
  const errorMessage = ref("");
  const successMessage = ref("");
  const router = useRouter();
  
  const register = async () => {
  errorMessage.value = "";
  successMessage.value = "";


  if (!email.value || !password.value) {
    errorMessage.value = "Email and password are required!";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    await setDoc(doc(db, "admin", user.uid), {
      name: name.value,
      email: email.value,
      password: password.value,
      role: "admin",
    });

    successMessage.value = "Registration successful! Redirecting...";
    setTimeout(() => router.push("/login"), 2000);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      errorMessage.value = "This email is already registered!";
    } else {
      errorMessage.value = "Registration failed: " + error.message;
    }
  }
};
  </script>
  