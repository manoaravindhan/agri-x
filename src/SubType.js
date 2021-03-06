import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import cloneDeep from 'lodash/cloneDeep';

const styles = theme => ({
    root: {
        paddingLeft: 25
    }
});

const SubType = ({ classes, mainType }) => {
    const [sub, setSub] = useState({
        101: true,
        102: true,
        201: true,
        202: true,
        203: true,
        301: true,
        302: true
    });
    const typeConf = {
        1: [{
            id: 101,
            type: 'Non-Rice'
        }, {
            id: 102,
            type: 'Rice'
        }],
        2: [{
            id: 201,
            type: 'High Yeild'
        }, {
            id: 202,
            type: 'Medium Yeild'
        }, {
            id: 203,
            type: 'Crop Failure'
        }],
        3: [{
            id: 301,
            type: 'Urban'
        }, {
            id: 302,
            type: 'Agri'
        }]
    }
    const handleChange = id => e => {
        let subz = cloneDeep(sub);
        subz[id] = e.target.checked;
        setSub(subz);
    }
    return [
        <Divider />,
        <Grid container className={classes.root}>
            {typeConf[mainType] && <Grid item md={12}>
                <Typography variant="h5">
                    Sub Types
                </Typography>
            </Grid>}
            {typeConf[mainType] && <Grid item md={12}>
                <FormGroup row>
                    {typeConf[mainType].map(conf => (
                        <FormControlLabel
                            key={conf.id}
                            control={
                                <Checkbox
                                    checked={sub[conf.id]}
                                    onChange={handleChange(conf.id)}
                                    value={conf.type}
                                    color="primary"
                                />
                            }
                            label={conf.type}
                        />
                    ))}
                </FormGroup>
            </Grid>}
        </Grid>

    ]
}

export default withStyles(styles)(SubType);
