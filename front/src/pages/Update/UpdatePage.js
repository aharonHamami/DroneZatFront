import classes from './updatePage.module.css';

import { useState } from 'react';

import InputList from '../../Components/Input/InputList';
import axiosClient from '../../client/axiosClient';

const changeValue = (setInputs, index, value) => {
    setInputs(state => {
        const newArray = [...state];
        const additionalValues = {
            value: value
        };
        if('validation' in newArray[index]) {
            additionalValues.validation = {
                ...newArray[index].validation,
                isValid: state[index].validation.pattern.test(value)
            };
        }
        newArray[index] = {
            ...newArray[index],
            ...additionalValues
        }
        return newArray; 
    });
};

const initialInputs = [
    {
        type: 'number',
        name: 'update_serial_number',
        label: 'מספר רחפן',
        value: '',
        validation: {
            isValid: true,
            pattern: /^[0-9]*$/, // integer numbers
            errorMessage: 'please write a valid email'
        }
    },
    {
        type: 'checkbox',
        name: 'update_in_the_air',
        label: 'באוויר',
        value: false
    }
];

const Update = () => {
    const [inputArray, setInputArray] = useState(initialInputs);
    // const [isOnAir] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // building form data
        const formData = new FormData();
        formData.append('update', true);
        for(let inputObj of inputArray){
            formData.set(inputObj.name, inputObj.value);
        }
        
        console.log('submitted');
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        
        axiosClient.postForm('/update', formData)
            .then(function (response) {
                //handle success
                console.log('success', response);
            })
            .catch(function (response) {
                //handle error
                console.log('error: ', response);
            });
        
    }
    
    
    
    return (
        <div className={classes.page}>
            <div className={classes.card}>
                <h1>עדכון רחפן:</h1>
                <form onSubmit={handleSubmit}>
                    <div className={classes.inputs}>
                        <InputList inputArray={inputArray} setValue={(index, value) => {changeValue(setInputArray, index, value)}}/>
                    </div>
                    <button type='submit'>עדכן</button>
                </form>
            </div>
        </div>
    );
}

export default Update;