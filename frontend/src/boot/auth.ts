import { defineBoot } from '#q-app/wrappers';
import { useAuthStore } from 'src/stores/auth';

export default defineBoot(async () => {
  const authStore = useAuthStore();
  await authStore.initialize();
});