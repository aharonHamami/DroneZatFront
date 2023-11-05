import classes from './toolbar.module.css';

import BarButton from './Button/BarButton';

const Toolbar = () => {
    return (
        <div className={classes.bar}>
            <BarButton link='/add' title='הוספה'/>
            <BarButton link='/update' title='עדכון'/>
        </div>
    );
}

export default Toolbar;