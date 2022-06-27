import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import ApiService from "../../api";
import '../../assets/payments/index.css'

const CheckoutForm = ({ setVisible, countDown }) => {
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('')
    const stripe = useStripe();
    const elements = useElements();

    //validation errors from CardElement
    const handleChange = (event) => {
        if(event.error){
            setError(event.error.message);
        } else {
            setError(null);
        }
    }
    //handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const card = elements.getElement(CardElement);
        console.log('what is card', card)
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: card
        });
        ApiService.saveStripeInfo({
            name: name,
            email,
            paymentMethod_id: paymentMethod.id
        })
        .then(resp => {
            if(resp.status === 200) {
                setVisible(false)
                countDown()
                setEmail('')
                setName('')
                card.clear()
            }
        })
        .catch(err => {
            console.log(err)
        })
    };

    return (
        <form onSubmit={ handleSubmit } className='stripe-form'>
            <div className='form-row'>
                <label htmlFor='email'>Email Address</label>
                <input
                    className='form-input'
                    id='email'
                    name='email'
                    type='email'
                    placeholder='enter your email'
                    required
                    value={ email }
                    onChange={(event)=> {
                        setEmail(event.target.value)}}
                />
            </div>
            <div className='form-row'>
                <label htmlFor='name'> Card Holder Name</label>
                <input
                    className='form-input'
                    id='name'
                    name='name'
                    type='name'
                    placeholder='enter card holder name'
                    required
                    value= { name }
                    onChange={ (event)=> {
                        setName(event.target.value)}}
                />
            </div>
            <div className='form-row'>
                <label for='card-element'>Credit or debit card number</label>
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
