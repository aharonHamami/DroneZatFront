import classes from './appLayout.module.css';

import Toolbar from './ToolBar/ToolBar';

const Layout = (props) => {
    return (
        <div className={classes.layout}>
            <Toolbar />
            {props.children}
        </div>
    );
}

export default Layout;