<script setup lang="ts">
  import axios from 'axios';
  import { computed, onMounted, ref } from 'vue';
  import { Task } from './types';
  import TaskItem from './components/tasks/TaskItem.vue';
  import SkeletonTaskItem from './components/tasks/SkeletonTaskItem.vue';
  import { useAutoAnimate } from '@formkit/auto-animate/vue';
  import BaseModal from './components/modals/BaseModal.vue';

  // API
  const apiResponse = ref<Task[]>([]);
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'X-Api-Key': import.meta.env.VITE_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  // The state for the loading animation
  const isLoading = ref(false);

  // The parent element for the auto-animate directive
  const [parent] = useAutoAnimate();

  // Rate limiting
  const lastRequestTime = ref(Date.now());
  const requestCount = ref(0);
  const MAX_REQUESTS = 5;
  const TIME_WINDOW = 10000; // 10 seconds
  const showRateLimitModal = ref(false);

  const showErrorModal = ref(false);
  const errorMessage = ref('');

  const canMakeRequest = computed(() => {
    const now = Date.now();
    if (now - lastRequestTime.value > TIME_WINDOW) {
      requestCount.value = 0;
      return true;
    }
    return requestCount.value < MAX_REQUESTS;
  });

  /**
   * Fetch tasks from the API
   *
   * @returns {Promise<void>}
   */
  const fetchTasks = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const res = await apiClient.get('/get');
      if (res.status === 200 && res.data && res.data.length > 1) {
        // Transform the API response to match our Task type
        // and convert the dueDate string to a Date object
        apiResponse.value = res.data.map(
          (task: {
            id: string;
            description: string;
            isComplete: boolean;
            dueDate: string | number | Date;
          }) => ({
            id: task.id,
            description: task.description,
            isComplete: task.isComplete,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          })
        );
      }
    } catch (e) {
      console.error(e);
      errorMessage.value = 'Failed to fetch tasks. Please try again.';
      showErrorModal.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(async () => {
    await fetchTasks();
  });

  /**
   * Get the sorted tasks
   *
   * @returns {ComputedRef<{ overdueTasks: Task[]; incompleteTasks: Task[]; completeTasks: Task[] }>} The sorted tasks
   */
  const getSortedTasks = computed(() => {
    if (apiResponse.value.length < 1) return [];

    const now = new Date().getTime();

    return (
      apiResponse.value
        // Create a shallow copy to avoid mutating the original array
        .slice()
        .sort((taskA, taskB) => {
          // Sort tasks: tasks with due dates first, then tasks without due dates
          if (!taskA.dueDate) return 1;
          if (!taskB.dueDate) return -1;
          return taskA.dueDate.getTime() - taskB.dueDate.getTime();
        })
        .reduce<{
          overdueTasks: Task[];
          incompleteTasks: Task[];
          completeTasks: Task[];
        }>(
          (acc, task) => {
            // Categorize tasks into overdue, incomplete, and complete
            if (task.isComplete) {
              acc.completeTasks.push(task);
            } else if (task.dueDate && task.dueDate.getTime() < now) {
              acc.overdueTasks.push(task);
            } else {
              acc.incompleteTasks.push(task);
            }
            return acc;
          },
          { overdueTasks: [], incompleteTasks: [], completeTasks: [] }
        )
    );
  });

  /**
   * Update the completion status of a task
   *
   * @param {Event} e - The event object
   * @param {Task['id']} currentTaskId - The ID of the task to update
   * @returns {Promise<void>}
   */
  const updateTaskCompletionStatus = async (
    e: Event,
    currentTaskId: Task['id']
  ): Promise<void> => {
    // If the user cannot make a request, show the rate limit modal
    if (!canMakeRequest.value) {
      showRateLimitModal.value = true;
      return;
    }

    const element = e.target as HTMLInputElement;

    // Set the loading state
    isLoading.value = true;
    try {
      requestCount.value++;
      lastRequestTime.value = Date.now();
      const res = await apiClient.patch(`/patch/${currentTaskId}`, {
        isComplete: element.checked,
      });
      if (res.status === 200 && res.data.status === 'success') {
        // Update the task's completion status in the apiResponse array
        const taskIndex = apiResponse.value.findIndex(
          (task) => task.id === currentTaskId
        );
        apiResponse.value[taskIndex].isComplete = element.checked;
      }
    } catch (e) {
      console.error(e);
      // Set the error message
      errorMessage.value = 'Failed to update task status. Please try again.';
      // Show the error modal
      showErrorModal.value = true;
    } finally {
      // Reset the loading state
      isLoading.value = false;
    }
  };

  /**
   * Update the due date of a task
   *
   * @param {Task['id']} taskId - The ID of the task to update
   * @param {Date | null} newDate - The new due date
   * @returns {Promise<void>}
   */
  const updateTaskDueDate = async (
    taskId: Task['id'],
    newDate: Date | null
  ): Promise<void> => {
    // If no new date is provided, do nothing
    if (!newDate) return;

    // If the user cannot make a request, show the rate limit modal
    if (!canMakeRequest.value) {
      showRateLimitModal.value = true;
      return;
    }

    // Set the loading state
    isLoading.value = true;
    try {
      requestCount.value++;
      lastRequestTime.value = Date.now();
      const res = await apiClient.patch(`/patch/${taskId}`, {
        dueDate: newDate,
      });
      if (res.status === 200 && res.data.status === 'success') {
        // Update the task's due date in the apiResponse array
        const taskIndex = apiResponse.value.findIndex(
          (task) => task.id === taskId
        );
        apiResponse.value[taskIndex].dueDate = newDate;
      }
    } catch (e) {
      console.error(e);
      // Set the error message
      errorMessage.value = 'Failed to update task due date. Please try again.';
      // Show the error modal
      showErrorModal.value = true;
    } finally {
      // Reset the loading state
      isLoading.value = false;
    }
  };

  // Check if all tasks are completed
  const areTasksCompleted = computed(() =>
    apiResponse.value.every((task) => task.isComplete)
  );

  // Sort tasks: overdue, incomplete, then complete
  const sortedTasks = computed(() => {
    if (getSortedTasks.value && 'overdueTasks' in getSortedTasks.value) {
      return [
        ...getSortedTasks.value.overdueTasks,
        ...getSortedTasks.value.incompleteTasks,
        ...getSortedTasks.value.completeTasks,
      ];
    }
    return [];
  });
</script>

<template>
  <header class="daisy-navbar bg-blue-500 mb-4">
    <h1 class="daisy-btn daisy-btn-ghost text-xl font-bold text-white">
      Todo App
    </h1>
  </header>
  <main class="flex flex-col min-h-screen items-center" ref="parent">
    <!-- Display tasks -->
    <template v-if="apiResponse.length > 0">
      <TaskItem
        v-for="task in sortedTasks"
        :key="task.id"
        :task="task"
        @update-completion="updateTaskCompletionStatus"
        @update-due-date="updateTaskDueDate"
      />
    </template>
    <!-- Display skeleton loader if no tasks are fetched -->
    <template v-else>
      <SkeletonTaskItem v-for="num in 5" :key="num" />
    </template>
  </main>
  <!-- Display completed tasks modal -->
  <BaseModal
    v-if="apiResponse.length > 1 && areTasksCompleted"
    type="completed"
  />
  <!-- Display loading modal -->
  <BaseModal v-if="isLoading" type="loading" :showCloseButton="false" />
  <!-- Display rate limit modal -->
  <BaseModal
    v-if="showRateLimitModal"
    type="rateLimit"
    @close="showRateLimitModal = false"
  />
  <!-- Display error modal -->
  <BaseModal
    v-if="showErrorModal"
    type="error"
    :message="errorMessage"
    @close="showErrorModal = false"
  />
</template>

<style lang="scss">
  .task-label {
    display: flex;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.25rem;
  }

  .dp__input {
    padding: 6px 0px 6px 30px !important;
  }
</style>
