import React from 'react'
import {Card,CardContent,CardActions,Typography,Button,Chip} from '@material-ui/core';
import {makeStyles,withStyles} from '@material-ui/core/styles';

const styles=makeStyles({
    card:{
        marginBottom:20,
        marginTop:20,
        backgroundColor:'#FFDADF',
        color:'#000000',
        borderRadius:"18px",
        opacity:"95%"
    },
    cContent:{
        padding:12
    },
    cardAction:
    {
        padding:18
    },
    button:{
        backgroundColor:'#f57b51'
    }  
})

export default function Jokescard({joke,like,unLike,index}) {
    const classes=styles();
    const Type =withStyles({
        root:{
            marginTop:10,
            marginBottom:10,
            backgroundColor:'#e7d39f',
            color:'#000000'
        }
        })(Chip);
    return (
        <Card variant="outlined" className={classes.card} id={`joke-${index}`}>
            <CardContent className={classes.cContent}>
            {joke.categories.length>0?(
                joke.categories.map((type)=>(
                <Type label={type} key={type} variant='outlined' color='primary'/>
                ))
            ):<Type label='regular' variant='outlined' color='primary'/>}
            <Typography>
                {joke.joke}
            </Typography>
            </CardContent>
            <CardActions className={classes.cardAction}>
            <Button variant='contained' onClick={()=>like(joke.id)} style={{backgroundColor:"#FFDAAE",fontWeight:'700'}}>
                Like 😍
            </Button>
            <Button variant='contained' onClick={()=>unLike(joke.id)} style={{backgroundColor:"#F12A41",fontWeight:'700'}}>
                Unlike 😖
            </Button>
            </CardActions>            
        </Card>
    )
}
