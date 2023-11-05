import classes from './Button.module.css';

const Button = (props) => {
    const {children, variant, ...buttonProps} = props;
    return (
        <button className={classes[variant]} id={classes.submitButton} {...buttonProps}>{children || ''}</button>
    );
}

export default Button;