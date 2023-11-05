import classes from './updatePage.module.css';

import { useState, useCallback } from 'react';

import InputList from '../../Components/Input/InputList';
import Button from '../../Components/Buttons/Submit/Button';
import InfoCard from '../../HOR/Card/InfoCard';
import axiosClient from '../../client/axiosClient';

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
    }
];

const TIMEOUT = 1000;
let sendRequestTimeout = null;

const Update = () => {
    const [inputArray, setInputArray] = useState(initialInputs);
    const [isOnAir, setIsOnAir] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(false); // is loading drone status
    const [upateSattus, setUpdateStatus] = useState(false); // is updating drone status
    
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
    
    const changeValue = useCallback((index, name, value) => {
        setInputArray(state => {
            const newArray = [...state];
            const additionalValues = {
                ...newArray[index],
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
                value: value
            }
            return newArray; 
        });
        
        if(name === 'update_serial_number') {
            setLoadingStatus(true);
            setErrorMessage(null);
            
            // restart timeout
            if(sendRequestTimeout) {
                clearTimeout(sendRequestTimeout);
            }
            if(value !== '') {
                sendRequestTimeout = setTimeout(() => {
                    console.log('send drone id, url: ', `/getDroneStatus/${value}`);
                    axiosClient.get(`/getDroneStatus/${value}`)
                        .then(response => {
                            console.log('response: ', response);
                            if('isOnAir' in response.data)
                                setIsOnAir(response.data.isOnAir);
                                // console.log("on air? - ", response.data.isOnAir);
                            else
                                setIsOnAir(false);
                        })
                        .catch(error => {
                            console.error("Couldn't get drone status, Error: ", error);
                            setErrorMessage('לא ניתן למצוא את הרחפן');
                        })
                        .finally(() => {
                            setLoadingStatus(false);
                        });
                }, TIMEOUT);
            }
        }
    }, [setInputArray]);
    
    const handleUpdateDroneStatus = useCallback((droneId, onAir) => {
        setUpdateStatus(true);
        
        const sendData = {
            'update_serial_number': droneId,
            'update_in_the_air': onAir
        };
        
        axiosClient.post('/update', sendData)
            .then((response) => {
                //handle success
                console.log('success', response);
                
                const data = response.data;
                if("onAir" in data) {
                    setIsOnAir(data.onAir !== 0);
                }
            })
            .catch((response) => {
                //handle error
                console.log('error: ', response);
            })
            .finally(() => {
                setUpdateStatus(false);
            });
    }, []);
    
    let content = null;
    
    if(upateSattus) {
        content = <p>מעדכן סטטוס רחפן...</p>
    }
    else {
        let serialNumberValue = '';
        const serialNumberObj = inputArray.find(inputObj => inputObj.name = 'update_serial_number');
        if(serialNumberObj) serialNumberValue = serialNumberObj.value;
        
        let updateComp = <p>loading...</p>
        if(!loadingStatus) {
            if(isOnAir) {
                updateComp = <>
                    <p style={{color: 'green'}}>הרחפן באוויר</p>
                    <Button type='submit' variant='error' onClick={() => handleUpdateDroneStatus(serialNumberValue, false)}>
                        עדכן על ירידה
                    </Button>
                </>
            }else {
                updateComp = <>
                    <p style={{color: 'red'}}>הרחפן אינו באוויר</p>
                    <Button type='submit' variant='success' onClick={() => handleUpdateDroneStatus(serialNumberValue, true)}>
                        עדכן על רחפן באוויר
                    </Button>
                </>;
            }
        }
        if(serialNumberValue === '') {
            updateComp = null;
        }
        if(errorMessage) {
            updateComp = <p style={{color: 'red'}}>{errorMessage}</p>
        }
        
        content = <>
            <h1>עדכון רחפן:</h1>
            <form onSubmit={handleSubmit}>
                <div className={classes.inputs}>
                    <InputList inputArray={inputArray} setValue={(index, value) => {changeValue(index, inputArray[index].name, value)}}/>
                </div>
                {updateComp}
            </form>
        </>;
    }
    
    
    
    return (
        <div className={classes.page}>
            <InfoCard style={{padding: '10px'}}>
                {content}
            </InfoCard>
        </div>
    );
}

export default Update;