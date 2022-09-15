import * as yup from 'yup';
const loginSchema = yup.object().shape({
    username: yup.string()
            .trim()
            .required('Username is a required field')
            .min(3, 'Username needs to be at least 3 characters'),
    password: yup.string()
            .trim()
            .required('Password is a required field')
            .min(3, 'Password needs to be at least 3 characters')
})

export default loginSchema;