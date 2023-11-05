import classes from './inputList.module.css';

const InputList = (props) => {
    
    function getInput(obj, index) {
        switch (obj.type) {
            case 'text-field':
            case 'password':
            case 'number': {
                return (
                    <input
                        type={obj.type} name={obj.name}
                        value={obj.value} /*error={!isValid}*/
                        onChange={event => {props.setValue(index, event.target.value)}}
                        />
                );
            }
            case 'select': {
                return (
                    <select name={obj.name}>
                        {obj.options.map(opt => {
                            return <option key={'option_'+opt.value} value={opt.value}>{opt.text}</option>
                        })}
                    </select>
                );
            }
            case 'datalist': {
                return <>
                    <input list={'datalist_'+index} value={obj.value} onChange={event => {props.setValue(index, event.target.value)}} />
                    <datalist id={'datalist_'+index} name={obj.name}>
                        {obj.options.map(value => {
                            return <option key={'option_'+value} value={value} />
                        })}
                    </datalist>
                </>;
            }
            case 'checkbox': {
                return (
                    <input 
                        type={obj.type} name={obj.name} checked={obj.value}
                        onChange={event => {props.setValue(index, event.target.checked)}}
                        />
                );
            }
            default:
                return null;
        }
    }
    
    return (
        props.inputArray.map((obj, index) => {
            let isValid = true;
            if('validation' in obj) {
                isValid = obj.validation.isValid;
            }
            
            return (
                <div key={'input_'+index} className={classes.inputField}>
                    <label style={{width: '85px', color: isValid ? 'black' : 'red', textAlign: 'start'}} >{obj.label}</label>
                    {getInput(obj, index)}
                </div>
            );
        })
    );
};

export default InputList;