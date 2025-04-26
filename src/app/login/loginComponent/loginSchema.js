import * as yup from 'yup';


const phoneRegex = /^[0-9]{10}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const loginSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),

  login: yup
    .string()
    .required('Email, username, or phone number is required')
    .test('is-valid-login', 'Invalid email, phone number, or username', (value) => {
    
      return emailRegex.test(value) || phoneRegex.test(value) || value.length >= 3; 
    }),
});

export default loginSchema;
