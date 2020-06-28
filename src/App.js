import React,{useEffect,useState} from 'react';
import {Card,CardContent,CardActions,CssBaseline,CircularProgress,Container,Typography,Button,Chip,Tabs,Tab, AppBar,FormControlLabel,Checkbox, Badge} from '@material-ui/core';
import {makeStyles,withStyles} from '@material-ui/core/styles';
import Jokescard from './Jokescard';
const styles=makeStyles({
  card:{
    marginBottom:20,
    marginTop:20,
    backgroundColor:'#ffd31d',
    color:'#000000'
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

function Chakri(){
  return (
    <div style={{textAlign:'center',padding:'2rem'}}>
      <CircularProgress/>
    </div>
  )
}

function App() {
  const [jokes,setJokes]=useState([]);
  const [jokeStack,setJokeStack]=useState([])
  const [liked,setLiked]=useState([]);
  const [currentTab,setCurrentTab]=useState(0);
  const [loading,setLoading]=useState(false);
  const [categories,setCategories]=useState([]);
  const [filterCategories,setFilterCategories]=useState([]);
  const classes=styles();

  useEffect(()=>{
    fetch('https://api.icndb.com/jokes')
    .then((res)=>res.json())
    .then((res)=>{
      // console.log(res);
      setJokes(res.value);
      setJokeStack(res.value.slice(0,10));
      observeElement();
    }).catch((err)=>console.log(err));
    fetch('https://api.icndb.com/categories')
    .then(res=>res.json())
    .then(res=>{
      setCategories(res.value)
      setFilterCategories(res.value)
    })
    .catch(err=>console.log(err))
  },[]);

  const like=(id)=>{
    if(liked.find(i=>i.id===id))
    return;
    const likedJ=jokes.find(i=>i.id===id)
    setLiked([likedJ,...liked])
    console.log(likedJ)
  };
  const unLike=(id)=>{
    const newLiked= liked.filter((i)=>i.id!==id)
    setLiked(newLiked);

  }
  const Type =withStyles({
    root:{
      marginTop:10,
      marginBottom:10,
      backgroundColor:'#e7d39f',
      color:'#000000'
    }
  })(Chip);
  const changeTab=(event,value)=>{
    setCurrentTab(value)
  }
const addMore=()=>{
  setLoading(true);
  setTimeout(()=>{
    setJokeStack(jokes.slice(0,jokeStack.length+10))
    setLoading((false))
  },400)
  
}
const observeElement=(bj)=>{
  if(!bj) return;
  const observer= new IntersectionObserver((entries)=>{
    if(entries[0].isIntersecting===true){
      addMore();
      
      console.log('Reached bottom of card')
      observer.unobserve(bj);
    }
  },{
    threshold:1
  });
  // const index=jokeStack.length-1;
  // const bjId=`joke-${index}`;
  // const bjElement=document.getElementById(bjId);
  observer.observe(bj);
}
useEffect(()=>{
  const bjElement=document.getElementById(`joke-${jokeStack.length-1}`);
  observeElement(bjElement);
},[jokeStack])

const toggleCategory=(event)=>{
  const category=event.target.name
  if(filterCategories.includes(category)){
    const filterCategoriesCopy=[...filterCategories]
    const categoryIndex=filterCategoriesCopy.indexOf(category)
    filterCategoriesCopy.splice(categoryIndex)
    setFilterCategories(filterCategoriesCopy)
  }else{
    setFilterCategories([...filterCategories,category])
  }
}
const matchCategory=(jCat)=>{
  for(let i=0;i< jCat.length;i++)
  {
    if(filterCategories.includes(jCat[i])) return true
  }
  return false
}
  return (
    <div className='app-Comp' >
      <CssBaseline />
      <Container>
        <AppBar style={{position:'sticky',backgroundColor:'#FFDADF',color:'#000',borderRadius:"7px"}}>
        <Tabs value={currentTab} onChange={changeTab} centered>
          <Tab label="Jokes" id="jokes-tab" aria-controls="jokes-panel" style={{fontWeight:"700"}}/>
          <Tab label={
            <Badge 
            color='secondary'
            badgeContent={
              liked.length>0?liked.length:null
            } style={{fontWeight:"700"}}
            >Likes</Badge>
          } id="like-tab" aria-controls="like-panel" />
        </Tabs>
        </AppBar>
        <div role='tabpanel' hidden={currentTab!==0}>
        {categories.map((category)=>(
          <FormControlLabel 
          key={category} 
          control={
          <Checkbox 
          name={category}  
          checked={filterCategories.includes(category)}
          onChange={toggleCategory}
          style={{color:"white"}}
          />} 
          label={category} />
        ))}
        {jokeStack.map((joke,index)=>{
          if (joke.categories.length===0|| matchCategory(joke.categories))
          {
          return <Jokescard joke={joke} key={joke.id} like={like} unLike={unLike} index={index}/>
          }})}
          {loading&&<Chakri/>}
        </div>
        <div role='tabpanel' hidden={currentTab!==1}>
          {liked.map((joke,index)=>(
            <Jokescard joke={joke} key={joke.id} like={like} unLike={unLike} index={index}/>
          ))}
        </div>

      </Container>
    </div>
  );
}

export default App;
