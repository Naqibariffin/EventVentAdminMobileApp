<template>
    <ion-page>
      <ion-content fullscreen class="flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
        <ion-grid class="h-screen flex items-center justify-center">
          <ion-row class="w-full flex justify-center">
            <ion-col size="12" size-md="8" size-lg="6">
              <div class="bg-white p-8 rounded-2xl shadow-2xl text-gray-800">
                <h2 class="text-3xl font-bold text-black-700 text-center mb-6">Admin FAQ</h2>
  
                <ion-accordion-group>
                  <ion-accordion v-for="(faq, index) in adminFaqs" :key="index">
                    <ion-item slot="header" class="font-semibold">{{ faq.question }}</ion-item>
                    <div slot="content" class="p-4 text-gray-600">{{ faq.answer }}</div>
                  </ion-accordion>
                </ion-accordion-group>
  
                <!-- Back Button -->
                <div class="flex justify-center mt-6">
                  <ion-button expand="full" class="text-white font-semibold text-lg py-3 rounded-xl"
                    style="--background: #267a1e ; border: none;"
                    @click="goBack">
                    Back to My Profile
                  </ion-button>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-page>
</template>
  
  <script>
  import { IonPage, IonContent, IonItem, IonAccordionGroup, IonAccordion, IonButton } from "@ionic/vue";
  import { useRouter } from "vue-router";
  
  export default {
    components: { IonPage, IonContent, IonItem, IonAccordionGroup, IonAccordion, IonButton },
    setup() {
      const router = useRouter();
  
      const goBack = () => {
        router.push("/my-profile");
      };
  
      return { goBack };
    },
    data() {
      return {
        adminFaqs: [
          {
            question: "How do I add a new user?",
            answer: "Go to the 'Manage Users' page, click 'Add User,' enter the details, and assign the appropriate role.",
          },
          {
            question: "How can I delete a user?",
            answer: "Navigate to the 'Manage Users' page, find the user, and click the delete icon. Confirm the action to remove them permanently.",
          },
          {
            question: "How do I manage event RSVPs?",
            answer: "In the 'Manage Events' section, you can view RSVP lists, remove attendees, and manage event details.",
          },
          {
            question: "Can I delete an event?",
            answer: "Yes, go to 'Manage Events,' find the event, and click 'Delete'. This will remove the event from the system.",
          },
          {
            question: "How do I reset a user's password?",
            answer: "Admins can reset user passwords directly in the 'Manage Users' section in the 'Edit'.",
          },
        ],
      };
    },
  };
  </script>
  