import { isFormComplete } from './frontend/src/utils/validation.js';
console.log(isFormComplete({ rating: '', message: '' }));
console.log(isFormComplete({ rating: 'good', message: '' }));
console.log(isFormComplete({ rating: 'good', message: 'hello' }));
