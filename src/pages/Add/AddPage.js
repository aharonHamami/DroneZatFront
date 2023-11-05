import classes from './addPage.module.css';

import { useState, useEffect } from 'react';

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

const DRONE = 'drone';
const droneInitialInputs = [
    {
        type: 'select',
        name: 'squad',
        label: 'פלוגה',
        value: 'a',
        options: [
            {
                value: 'a',
                text: 'פלוגה א'
            },
            {
                value: 'b',
                text: 'פלוגה ב'
            },
            {
                value: 'c',
                text: 'פלוגה ג'
            }
        ]
    },
    {
        type: 'number',
        name: 'serial_number',
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
        name: 'in_the_air',
        label: 'באוויר',
        value: false
    }
];

const SQUAD = 'squad';
const squadInitialInputs = [
    {
        type: 'text-field',
        name: 'squad',
        label: 'שם פלוגה',
        value: ''
    }
];

const Add = () => {
    const [subject, setSubject] = useState(SQUAD); // 'squad' || 'drone'
    const [inputArray, setInputArray] = useState(droneInitialInputs);
    const [isExists] = useState(false);
    
    useEffect(() => {
        switch(subject) {
            case SQUAD: {
                setInputArray(squadInitialInputs);
                break;
            }
            case DRONE: {
                setInputArray(droneInitialInputs);
                break;
            }
            default:
                setInputArray([]);
        }
    }, [subject]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // building form data
        const formData = new FormData();
        formData.append('add', true);
        for(let inputObj of inputArray){
            formData.append(inputObj.name, inputObj.value);
        }
        
        console.log('submitted');
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        
        
        // axiosClient.post('/add', formData, {Headers: { "Content-Type": "multipart/form-data" }})
        axiosClient.postForm('/add', formData)
            .then(function (response) {
                //handle success
                console.log('success', response);
            })
            .catch(function (response) {
                //handle error
                console.log('error: ', response);
            });
            
        
        // const sendData = {};
        // for(let inputObj of inputArray){
        //     sendData[inputObj.name] = inputObj.value;
        // }
        // axiosClient.post('/add', sendData)
        //     .then(function (response) {
        //         //handle success
        //         console.log('success', response);
        //     })
        //     .catch(function (response) {
        //         //handle error
        //         console.log('error: ', response);
        //     });
        
    }
    
    let errorMessage = '';
    if(isExists) {
        if(subject === DRONE) {
            errorMessage = 'הרחפן הזה כבר קיים במערכת';
        }else if(subject === SQUAD) {
            errorMessage = 'הפלוגה הזו כבר קיימת במערכת';
        }
    }
    
    return (
        <div className={classes.page}>
            <div className={classes.card}>
                <div className={classes.selectSection}>
                    <button className={subject===SQUAD ? classes.selected : null} onClick={() => {setSubject(SQUAD)}}>פלוגה</button>
                    <button className={subject===DRONE ? classes.selected : null} onClick={() => {setSubject(DRONE)}}>רחפן</button>
                </div>
                <div className={classes.content}>
                <h1>הוספה:</h1>
                <form onSubmit={handleSubmit}>
                    <div className={classes.inputs}>
                        <InputList inputArray={inputArray} setValue={(index, value) => {changeValue(setInputArray, index, value)}}/>
                    </div>
                    <p style={{color: 'red'}}>{errorMessage}</p>
                    <button type='submit'>הוסף</button>
                </form>
            </div>
            </div>
        </div>
    );
}

export default Add;