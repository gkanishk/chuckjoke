import React, { useEffect, useState } from 'react';
import { CssBaseline, Container, Tabs, Tab, AppBar, FormControlLabel, Checkbox, Badge } from '@material-ui/core';
import JokesCard from '../components/JokesCard';
import Loader from '../components/Loader';


export const Home = () => {
    const [jokes, setJokes] = useState([]);
    const [jokeStack, setJokeStack] = useState([])
    const [liked, setLiked] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filterCategories, setFilterCategories] = useState([]);

    useEffect(() => {
        fetch('https://api.icndb.com/jokes')
            .then((res) => res.json())
            .then((res) => {
                setJokes(res.value);
                setJokeStack(res.value.slice(0, 10));
                observeElement();
            }).catch((err) => console.log(err));
        fetch('https://api.icndb.com/categories')
            .then(res => res.json())
            .then(res => {
                setCategories(res.value)
                setFilterCategories(res.value)
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        const bjElement = document.getElementById(`joke-${jokeStack.length - 1}`);
        observeElement(bjElement);
    }, [jokeStack])

    const like = (id) => {
        if (liked.find(i => i.id === id))
            return;
        const likedJ = jokes.find(i => i.id === id)
        setLiked([likedJ, ...liked])
        console.log(likedJ)
    };
    const unLike = (id) => {
        const newLiked = liked.filter((i) => i.id !== id)
        setLiked(newLiked);

    }
    const changeTab = (event, value) => {
        setCurrentTab(value)
    }
    const addMore = () => {
        setLoading(true);
        setTimeout(() => {
            setJokeStack(jokes.slice(0, jokeStack.length + 10))
            setLoading((false))
        }, 400)

    }
    const observeElement = (bj) => {
        if (!bj) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting === true) {
                addMore();
                observer.unobserve(bj);
            }
        }, {
            threshold: 1
        });
        observer.observe(bj);
    }
    
    const toggleCategory = (event) => {
        const category = event.target.name
        if (filterCategories.includes(category)) {
            const filterCategoriesCopy = [...filterCategories]
            const categoryIndex = filterCategoriesCopy.indexOf(category)
            filterCategoriesCopy.splice(categoryIndex)
            setFilterCategories(filterCategoriesCopy)
        } else {
            setFilterCategories([...filterCategories, category])
        }
    }
    const matchCategory = (jCat) => {
        for (let i = 0; i < jCat.length; i++) {
            if (filterCategories.includes(jCat[i])) return true
        }
        return false
    }
    return (
        <div className='app-Comp' >
            <CssBaseline />
            <Container>
                <AppBar style={{ position: 'sticky', backgroundColor: '#FFDAAF', color: '#000', borderRadius: "7px" }}>
                    <Tabs value={currentTab} onChange={changeTab} centered>
                        <Tab label="Jokes" id="jokes-tab" aria-controls="jokes-panel" style={{ fontWeight: "700" }} />
                        <Tab label={
                            <Badge
                                color='secondary'
                                badgeContent={
                                    liked.length > 0 ? liked.length : null
                                } style={{ fontWeight: "700" }}
                            >Likes</Badge>
                        } id="like-tab" aria-controls="like-panel" />
                    </Tabs>
                </AppBar>
                <div role='tabpanel' hidden={currentTab !== 0}>
                    {categories.map((category) => (
                        <FormControlLabel
                            key={category}
                            control={
                                <Checkbox
                                    name={category}
                                    checked={filterCategories.includes(category)}
                                    onChange={toggleCategory}
                                    style={{ color: "white" }}
                                />}
                            label={category} />
                    ))}
                    {jokeStack.map((joke, index) => {
                        if (joke.categories.length === 0 || matchCategory(joke.categories)) {
                            return <JokesCard joke={joke} key={joke.id} like={like} unLike={unLike} index={index} />
                        }
                    })}
                    {loading && <Loader />}
                </div>
                <div role='tabpanel' hidden={currentTab !== 1}>
                    {liked.length>0?liked.map((joke, index) => (
                        <JokesCard joke={joke} key={joke.id} like={like} unLike={unLike} index={index} />
                    )):
                    <div className="empty-image-container" >
                    <img src="/empty.svg" alt="Empty Image" />
                    <span>No Liked Jokes found! Please like them to see some magic.</span>
                    </div>
                    }
                </div>

            </Container>
        </div>
    )
}