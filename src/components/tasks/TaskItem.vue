<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import type { Task } from '../../types';

  // The task item props
  const props = defineProps<{
    task: Task;
  }>();

  // The state for the overdue status
  const isOverdue = computed(
    () =>
      props.task.dueDate &&
      props.task.dueDate.getTime() < new Date().getTime() &&
      !props.task.isComplete
  );

  // The state for the wiggle animation
  const shouldWiggle = ref(false);
  const hasWiggled = ref(false);
  const wiggleClass = ref('');

  // The classes for the wiggle animation
  const wiggleClasses = ['wiggle-left-right', 'wiggle-right-left'];

  /**
   * Watch for changes in the overdue status
   *
   * @param {boolean} newValue - The new value
   * @param {boolean} oldValue - The old value
   */
  watch(
    isOverdue,
    (newValue, oldValue) => {
      if (newValue && !oldValue && !hasWiggled.value) {
        setTimeout(() => {
          wiggleClass.value =
            wiggleClasses[Math.floor(Math.random() * wiggleClasses.length)];
          shouldWiggle.value = true;
          setTimeout(() => {
            shouldWiggle.value = false;
            hasWiggled.value = true;
          }, 1000);
        }, 200);
      }
    },
    { immediate: true }
  );

  /**
   * Compute the background class for the task
   *
   * @returns {string} The background class
   */
  const taskBackgroundClass = computed(() => {
    if (props.task.isComplete) return 'bg-green-300';
    if (isOverdue.value) return 'bg-red-300';
    return 'bg-gray-300';
  });

  /**
   * Display the due date in the format of MM/DD/YYYY
   *
   * @param {Date} currentDate - The current date
   * @returns {string} The formatted date
   */
  const displayDueDate = (currentDate: Date): string => {
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
  };
</script>

<template>
  <!-- Display the task item -->
  <div
    class="daisy-form-control mb-5 p-8 w-full md:w-3/5 rounded-md hover:border-black"
    :class="[taskBackgroundClass, { [wiggleClass]: shouldWiggle }]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-grow">
        <!-- Display the task label -->
        <label
          class="task-label cursor-pointer flex items-center"
          :class="{ completed: task.isComplete }"
        >
          <input
            @change="$emit('update-completion', $event, task.id)"
            type="checkbox"
            :checked="task.isComplete"
            class="daisy-checkbox checkbox-primary bg-white rounded-sm mr-2"
          />
          <span
            class="daisy-label-text text-lg font-semibold"
            :class="{ 'line-through': task.isComplete }"
          >
            {{ task.description }}
          </span>
        </label>
      </div>

      <!-- Display the due date -->
      <span
        v-if="task.dueDate"
        class="daisy-label-text text-right border-2 p-2 border-gray-800 ml-4"
      >
        {{ displayDueDate(task.dueDate) }}
      </span>

      <!-- Display the date picker -->
      <VueDatePicker
        v-else
        ref="datepicker"
        allowPreventDefault
        @click.stop
        :space-confirm="false"
        v-model="task.dueDate"
        :enable-timepicker="false"
        :clearable="false"
        placeholder="Date"
        auto-apply
        class="!w-20 border-2 border-gray-800 ml-4"
        @update:model-value="
          (newDate) => $emit('update-due-date', task.id, newDate)
        "
      />
    </div>
  </div>
</template>

<style scoped>
  @keyframes wiggle-left-right {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }

  @keyframes wiggle-right-left {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
  }

  .wiggle-left-right {
    animation: wiggle-left-right 0.5s ease-in-out 2;
  }
  .wiggle-right-left {
    animation: wiggle-right-left 0.5s ease-in-out 2;
  }
</style>
