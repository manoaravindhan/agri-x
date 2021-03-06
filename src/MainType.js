import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { green } from '@material-ui/core/colors';

const styles = theme => ({
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    greenAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: green[500],
      },
    header:{
        background: 'black'
    },
    headText:{
        color:'white',
        margin: 1
    }
});

const MainType = ({ classes,handleChange }) => {
    const [checked, setChecked] = useState(1);
    const typeConf = [{
        id: 1,
        name: 'Crop',
        subText: 'Classification of crops',
        icon: <i className="material-icons">eco</i>
    }, {
        id: 2,
        name: 'Yield',
        subText: 'Statistics of profit',
        icon: <i className="material-icons">donut_large</i>
    }, {
        id: 3,
        name: 'LULC',
        subText: 'Land Use / Land Cover',
        icon: <i className="material-icons">crop_original</i>
    }]
    const handleToggle = value => () => {
        setChecked(value.id);
        handleChange(value.id);
    };

    return [
        <Card className={classes.header}>
            <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.greenAvatar}>
            <AccountCircle/>
          </Avatar>
        }
            title={<h3 className={classes.headText}>Agri X</h3>}
        subheader={<h6 className={classes.headText}>October 31, 2019</h6>}
      />
        </Card>,
        <Divider variant="middle"/>,
        <List className={classes.list}>
            {typeConf.map(value => {
                return [
                    <ListItem key={value.id} button onClick={handleToggle(value)}>
                        <ListItemIcon fontSize="large">
                            {value.icon}
                        </ListItemIcon>
                        <ListItemText primary={value.name} secondary={value.subText} />
                        <ListItemSecondaryAction>
                            <Checkbox
                                edge="start"
                                onClick={handleToggle(value)}
                                checked={checked === value.id}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemSecondaryAction>
                    </ListItem>,
                    <Divider variant="middle" key={`dvdr${value.id}`} />
                ]
            })}
        </List>
    ]
}

export default withStyles(styles)(MainType);
