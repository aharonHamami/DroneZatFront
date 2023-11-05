import classes from './infoCard.module.css';

const Card = (props) => {
    const {children, ...divProps} = props;
    
    return (
        <div className={classes.card} {...divProps}>
            {children}
        </div>
    );
}

export default Card;