import classes from './barButton.module.css';

import { Link } from 'react-router-dom';

const Button = (props) => {
    return (
        <Link to={props.link} className={classes.button}>
            {props.title}
        </Link>
    );
}

export default Button;