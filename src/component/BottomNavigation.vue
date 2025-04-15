<template>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
  
      <ion-tab-bar slot="bottom" class="custom-tab-bar">

        <ion-tab-button tab="dashboard" href="/dashboard">
          <ion-icon :icon="peopleOutline" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <!-- Manage Users -->
        <ion-tab-button tab="users" href="/manage-user">
          <ion-icon :icon="peopleOutline" />
          <ion-label>Manage Users</ion-label>
        </ion-tab-button>
  
        <!-- Manage Events -->
        <ion-tab-button tab="events" href="/manage-event">
          <ion-icon :icon="calendarOutline" />
          <ion-label>Manage Events</ion-label>
        </ion-tab-button>
  
        <!-- My Profile -->
        <ion-tab-button tab="profile" href="/my-profile">
          <ion-icon :icon="personOutline" />
          <ion-label>My Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </template>
  
  <script setup>
  import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/vue";
  import { peopleOutline, calendarOutline, personOutline } from "ionicons/icons";
  </script>
  
  <style scoped>
  .custom-tab-bar {
    --background: #64af6a;
    --border-top: 1px solid #000000;
  }
  
  ion-tab-button {
    --color: #38613b;
    --color-selected: #162718;
  }
  </style>
  