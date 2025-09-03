
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Replace 'your-repository-name' with the actual name of your repo
  base: '/TrainingModule/', 
});