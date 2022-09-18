import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import {Grid, Paper, TextField,} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import { Redirect } from 'react-router-dom';
import { useAlert } from 'react-alert'

import axios from 'axios';


const styles = theme => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        width: '100%',
        'min-height': '100vh',
        top: '0',
        overflow: 'hidden'
    },
    colorPrimary: {
        backgroundColor: '#B2DFDB',
    },
    barColorPrimary: {
        backgroundColor: '#00695C',
    },
    paper: {
        overflow: 'scroll',
        height: '80%',
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
    },
});
class NewMethod extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            author: '',
            intention: [],
            redirect: false
        }
    }







    validate () {
        if (this.state.name === '' || this.state.intention === '' || this.state.description === '' || this.state.author === '') {
            alert('All field is required')
        } else {
            let test = {
                "name": "asdsad",
                "description": "a",
                "author": "Mico 22 uuuuu",
                "intention" : [
                    "intention 1",
                    "intention 2"
                ]
            };
            let data = JSON.parse(JSON.stringify(this.state))
            data.edge = [];
            data.essence_kernel = [];


            console.log(data)

            axios.post('http://localhost:8085/method',data)
                .then( async result => {
                    console.log(result)
                    await this.props.history.push("editor/"+result.data.insertedId)
                        ;

                }).catch(err => {
                    console.log(err)
            })
            // this.props.history.push("editor/1");
        }
    }

    updateState (event) {
        let field = event.target.name;
        this.state[field] = event.target.value

    }

    updateIntention (event) {

    }

    closeNewMthod (){
        console.log(this.state)
        this.props.cancel()
    }

    render() {
        const { classes }= this.props;
        const intention = this.state.intention
        return (
                <div className={classes.paper}>Make Your Own Method

                    <TextField id="name"
                               fullWidth
                               label="Method Name"
                               onChange={this.updateState.bind(this)}
                               name="name">
                    </TextField>
                    <br/>
                    <TextField id="description"
                               fullWidth
                               multiline
                               rows={3}
                               label="Method Description"
                               onChange={this.updateState.bind(this)}
                               name="description">
                    </TextField>
                    <br/>
                    {this.state.intention.map((data, index) =>
                        <TextField
                            fullWidth
                            key={index}
                            value={data}
                            label={"Method Intention "+ (index+1) }
                            // onChange={event => this.state.intention[index] = event.target.value }
                            onChange={event => this.setState({
                                intention: [
                                    ...intention.slice(0, index),
                                    event.target.value,
                                    ...intention.slice(index + 1)
                                ]
                            }) }    >
                        </TextField>
                    )}
                    <br/>
                    <br/>

                    <Button variant="outlined" color="primary" onClick={() => this.setState({intention: [...intention, '']})}>
                        Add intention
                    </Button>

                    <br/>
                    <TextField id="author"
                               fullWidth
                               onChange={this.updateState.bind(this)}
                               label="Creator"
                               name="author">
                    </TextField>
                    <br/>
                    <br/>
                    <br/>

                    <Button variant="contained" color="primary" onClick={this.validate.bind(this)}>
                        Create New Method
                    </Button>

                    <Button variant="contained" color="secondary" onClick={this.closeNewMthod.bind(this)}>
                        Cancel
                    </Button>
                </div>

        );
    }

}


export default withStyles(styles)(NewMethod);
