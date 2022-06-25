import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
//import { loadStripe } from '@stripe/stripe-js/pure';
import ApiService from "../../api";


const CheckoutForm = () => {
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
//    const stripe = useStripe();
//    const elements = useElements();

//    //validation errors from CardElement
//    const handleChange = (event) => {
//        if(event.error){
//            setError(event.error.message);
//        } else {
//            setError(null);
//        }
//    }
//    //handle form submission
//    const handleSubmit = async (event) => {
//        event.preventDefault();
//        const card = elements.getElement(CardElement);
//        const { paymentMethod, error } = await stripe.createPaymentMethod({
//            type: 'card',
//            card: card
//        });
//    };
    const handleChange = () => {
        console.log('handle change has been triggered')
    }

    const handleSubmit = () => {
        console.log('handle submit has been triggered')
    }

    return (
        <form onSubmit={ handleSubmit } className='stripe-form'>
            <div className='form-row'>
                <label htmlFor='email'>Email Address</label>
                <input
                    className='form-input'
                    id='email'
                    name='name'
                    type='email'
                    placeholder='enter your email'
                    required
                    value={ email }
                    onChange={(event)=> {
                        setEmail(event.target.value)}}
                />
            </div>
            <div className='form-row'>
                <label for='card-element'>Credit or debut card</label>
                <CardElement id='card-element' onChange={handleChange}/>
                <div className='card-errors' role='alert'>{ error }</div>
            </div>
            <button type='submit' className='submit-btn'>
                Submit Payment
            </button>
        </form>
    );
};

export default CheckoutForm;