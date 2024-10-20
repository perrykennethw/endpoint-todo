<script setup lang="ts">
  import { computed } from 'vue';

  // The modal props
  interface ModalProps {
    type: 'completed' | 'loading' | 'rateLimit' | 'error';
    title?: string;
    message?: string;
    showCloseButton?: boolean;
  }

  const props = withDefaults(defineProps<ModalProps>(), {
    showCloseButton: true,
  });

  const emit = defineEmits(['close']);

  // The modal content
  const modalContent = computed(() => {
    switch (props.type) {
      case 'completed':
        return {
          title: 'Tasks Completed!',
          message:
            "Congratulations! You've completed all your tasks. Enjoy your day!",
          buttonClass: 'bg-green-500 hover:bg-green-700',
        };
      case 'loading':
        return {
          title: 'Loading',
          message: '',
          buttonClass: '',
        };
      case 'rateLimit':
        return {
          title: 'Rate Limit Exceeded',
          message:
            "You've reached the maximum number of requests. Please try again in a few moments.",
          buttonClass: 'bg-blue-500 hover:bg-blue-700',
        };
      case 'error':
        return {
          title: 'Error',
          message: props.message || 'An error occurred. Please try again.',
          buttonClass: 'bg-red-500 hover:bg-red-700',
        };
      default:
        return {
          title: props.title || '',
          message: props.message || '',
          buttonClass: 'bg-gray-500 hover:bg-gray-700',
        };
    }
  });

  const handleClose = () => {
    emit('close');
  };
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    :id="`${props.type}-modal`"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
    >
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ modalContent.title }}
        </h3>
        <div v-if="props.type !== 'loading'" class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">
            {{ modalContent.message }}
          </p>
        </div>
        <div v-else class="mt-2 px-7 py-3">
          <div class="daisy-loading daisy-loading-spinner"></div>
        </div>
        <div
          v-if="showCloseButton && props.type !== 'loading'"
          class="items-center px-4 py-3"
        >
          <button
            id="ok-btn"
            @click="handleClose"
            :class="[
              'px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2',
              modalContent.buttonClass,
            ]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
