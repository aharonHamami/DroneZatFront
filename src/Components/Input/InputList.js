

const InputList = (props) => {
    
    function getInput(obj, index) {
        
        let isValid = true;
        if('validation' in obj) {
            isValid = obj.validation.isValid;
        }
        
        const inputComp = <label style={{width: '85px', color: isValid ? 'black' : 'red', textAlign: 'start'}} >{obj.label}</label>;
        
        switch (obj.type) {
            case 'text-field':
            case 'password':
            case 'number': {
                return (
                    <div key={'input_'+index} style={{display: 'flex', flexDirection:'row', gap: '10px', textAlign: 'left'}}>
                        {inputComp}
                        <input
                            type={obj.type} name={obj.name}
                            value={obj.value} /*error={!isValid}*/
                            onChange={event => {props.setValue(index, event.target.value)}}
                            />
                    </div>
                );
            }
            case 'select': {
                return (
                    <div key={'input_'+index} style={{display: 'flex', flexDirection:'row', gap: '10px', textAlign: 'left'}}>
                        {inputComp}
                        <input list="datalist"/>
                        <datalist id='datalist' name={obj.name}>
                            {obj.options.map(opt => {
                                return <option key={'option_'+opt.value} value={opt.value} />//{opt.text}</option>
                            })}
                        </datalist>
                    </div>
                );
            }
            case 'checkbox': {
                return (
                    <div key={'input_'+index} style={{display: 'flex', flexDirection:'row', gap: '10px', textAlign: 'left'}}>
                        {inputComp}
                        <input 
                            type={obj.type} name={obj.name} checked={obj.value}
                            onChange={event => {props.setValue(index, event.target.checked)}}
                            />
                    </div>
                );
            }
            default:
                return null;
        }
    }
    
    return (
        props.inputArray.map((obj, index) => {
            return getInput(obj, index);
        })
    );
};

export default InputList;