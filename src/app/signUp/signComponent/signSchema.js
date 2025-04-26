import * as yup from 'yup';

const signSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),

  fullname: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, 'Full name must only contain letters and spaces')
    .min(3, 'Full name must be at least 3 characters long')
    .required('Full name is required'),

  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .required('Username is required')
});

export default signSchema;
