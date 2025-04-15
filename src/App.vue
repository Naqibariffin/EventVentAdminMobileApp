<template>
  <ion-app>
    <ion-router-outlet />
    
    <!-- Show BottomNavigation only for admins -->
    <BottomNavigation v-if="isAdmin" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { ref } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../src/firebase'; 
import BottomNavigation from '../src/component/BottomNavigation.vue';

const isAdmin = ref(false);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const db = getFirestore();
    const q = query(collection(db, 'admin'), where('email', '==', user.email));
    const querySnapshot = await getDocs(q);

    isAdmin.value = !querySnapshot.empty; // true if admin exists
  } else {
    isAdmin.value = false;
  }
});
</script>
