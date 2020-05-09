import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import Speech from 'react-speech';

import {
  getIP,
  getAllQuotes
} from './Api.js'

import {
  Grid,
  Divider,
  Avatar,
  Card,
  CardContent,
  Fab,
  Link
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => {
  return ({
    root: {
      minHeight: "100vh",
      padding: theme.spacing(1),
      [theme.breakpoints.up("xs")]: {
        padding: theme.spacing(2),
      },
      backgroundColor: "black",
      backgroundImage:
        "radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),\
        radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),\
        radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),\
        radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px)",
      backgroundSize: "550px 550px, 350px 350px, 250px 250px, 150px 150px",
      backgroundPosition: "0 0, 40px 60px, 130px 270px, 70px 100px",
    },
    mainColumn: {
      width: "100%",
      maxWidth: 1280
    },
    detailSection: {
      maxWidth: 500
    },
    mapContainer: {
      width: "100%",
      height: 250,
      position: "relative"
    },
    robotAvatar: {
      width: 120,
      height: 120,
      zIndex: 1
    },
    map: {
      width: "100%",
      maxHeight: 150,
      objectFit: "cover",
      borderRadius: theme.spacing(1),
      position: "absolute",
      top: 90
    },
    quoteBotIntro: {
      fontSize: 20,
      padding: theme.spacing(3),
      color: theme.palette.primary.contrastText
    },
    quoteSection: {
      maxWidth: 500
    },
    quoteCard: {
      flex: "0 0 auto",
      width: "100%",
      fontSize: 22,
      maxWidth: 500,
      margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      borderLeft: `solid ${theme.spacing(1)}px ${theme.palette.divider}`,
      position: "relative",
      overflow: "visible",
      display: "flex",
      justifyContent: "center",
    },
    quoteCardContent: {
      width: "100%"
    },
    quoteAuthor: {
      fontStyle: "italic",
      float: "right",
      fontSize: 20,
      marginBottom: theme.spacing(5)
    },
    quoteReader: {
      position: "absolute",
      fontSize: 30,
      top: -30,
      right: 20,
      "&:hover": {
        textDecoration: "none"
      }
    },
    quoteReaction: {
      fontSize: 30,
      position: "absolute",
      bottom: -20
    },
    quoteReactionLove: {
      fontSize: 30,
      position: "absolute",
      bottom: -20,
      right: 50
    },
    quoteReactionVomit: {
      fontSize: 30,
      position: "absolute",
      bottom: -20,
      left: 50
    },
    pastQuotesSection: {
      overflow: "auto"
    },
    reaction: {
      fontSize: 180,
      color: "rgba(0, 0,0, 0.3)",
      position: "absolute",
      bottom: 20,
      right: 50
    },
    reactionDate: {
      position: "absolute",
      bottom: 20,
      left: 50
    },
    divider: {
      width: "70%",
      margin: `${theme.spacing(3)}px 0`
    }
  })
});


function App() {
  const classes = useStyles();
  const { ip, lat, lon, city, allQuotes, isFetchingLocation, isFetchingQuotes } = useSelector(state => state.app)
  const dispatch = useDispatch();

  const reactions = {
    'vomit': '🤮',
    'shrug': '🤷🏻‍♂️',
    'love': '😍'
  }
  const [quotePage, setQuotePage] = useState(1);
  const [quote, setQuote] = useState();
  const [previousQuotes, setPreviousQuotes] = useState([]);

  useEffect(() => {
    getIP(dispatch);
    getAllQuotes(quotePage, dispatch);
  }, [dispatch])

  useEffect(() => {
    const previousQuotesIds = previousQuotes.map(q => q.id)
    const notSeenQuotes = allQuotes?.filter(q => !previousQuotesIds.includes(q.id))
    if (notSeenQuotes.length > 0) {
      setQuote(notSeenQuotes[0])
    } else {
      if (previousQuotesIds.length > 0) {
        getAllQuotes(quotePage + 1, dispatch);
        setQuotePage(quotePage + 1)
      }
    }
  }, [allQuotes, previousQuotes])

  return (
    <Grid container className={classes.root} justify="center" alignItems="flex-start">
      <Grid container className={classes.mainColumn} direction="column" alignItems="center">
        <Grid container item xs={12} className={classes.detailSection} justify="center">
          <Grid container item xs={12} className={classes.mapContainer} justify="center">
            <Avatar
              alt="Robot Avatar"
              src={`https://robohash.org/${ip}.png?bgset=bg2`}
              className={classes.robotAvatar}
            />
            {isFetchingLocation || !lat || !lon
              ? <Skeleton variant="rect" width={500} height={150} animation="wave" />
              : <img
                alt="Quote bot location map"
                src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s(${lon},${lat})/${lon},${lat},9.67,0.00,0.00/500x200@2x?access_token=pk.eyJ1IjoicmVhbHNlYW4iLCJhIjoiY2s3bnB3YjhjMDE4YjNncGdhaDFraHR2ZiJ9.HbrfAF0MChL2E_T7ZROD9A`}
                className={classes.map}
              />
            }
          </Grid>
          <Grid container item xs={12} className={classes.quoteBotIntro}>
            Hi <span role="img" aria-label="wave">👋🏼</span> I'm Quote Bot.
            <br />
            I was built in {city} to find quotes for you. Rate each quote and I will try to find even better ones for you!
          </Grid>
          <Divider className={classes.divider} />
        </Grid>
        <Grid container item xs={12} className={classes.quoteSection} justify="center">
          <Speech
            stop={true}
            text={quote?.content?.rendered.replace(/(<([^>]+)>)/ig, '').replace(/&[#A-Za-z0-9]+;/gi, '')}
            voice="Google UK English Female"
            className={classes.quoteReader}
          />
          <Card className={classes.quoteCard}>
            <CardContent className={classes.quoteCardContent}>
              {isFetchingQuotes
                ? <>
                  <Skeleton animation="wave" />
                  <Skeleton animation="wave" />
                  <Skeleton animation="wave" />
                  <Skeleton animation="wave" />
                  <Skeleton animation="wave" width={200} />
                  <Skeleton animation="wave" width={200} className={classes.quoteAuthor} />
                </>
                : <>
                  <div dangerouslySetInnerHTML={{ __html: quote?.content?.rendered }} />
                  <div dangerouslySetInnerHTML={{ __html: quote?.title?.rendered }} className={classes.quoteAuthor} />
                </>
              }
            </CardContent>
            {!isFetchingQuotes &&
              <>
                <Fab
                  aria-label="speaker"
                  className={classes.quoteReader}
                  component={Link}
                  target="_blank"
                  title="Quote reader"
                  href={`http://api.voicerss.org/?key=0bb282d009b0476f9790b9b76954f35e&src=${quote?.content?.rendered.replace(/(<([^>]+)>)/ig, '').replace(/&[#A-Za-z0-9]+;/gi, '')}&hl=en-us`}
                >
                  <span role="img" aria-label="speaker">🗣</span>
                </Fab>
                <Fab
                  aria-label="vomit"
                  className={classes.quoteReactionVomit}
                  onClick={() => setPreviousQuotes([{ ...quote, reaction: "vomit", date: Date.now() }, ...previousQuotes])}
                >
                  <span role="img" aria-label="vomit">🤮</span>
                </Fab>
                <Fab
                  aria-label="shrug"
                  className={classes.quoteReaction}
                  onClick={() => setPreviousQuotes([{ ...quote, reaction: "shrug", date: Date.now() }, ...previousQuotes])}
                >
                  <span role="img" aria-label="shrug">🤷🏻‍♂️</span>
                </Fab>
                <Fab
                  aria-label="love"
                  className={classes.quoteReactionLove}
                  onClick={() => setPreviousQuotes([{ ...quote, reaction: "love", date: Date.now() }, ...previousQuotes])}
                >
                  <span role="img" aria-label="love">😍</span>
                </Fab>
              </>
            }
          </Card>
          <Divider className={classes.divider} />
        </Grid>
        <Grid container item xs={12} className={classes.pastQuotesSection} wrap="nowrap">
          {previousQuotes.map(quote =>
            <Card key={quote.id} className={classes.quoteCard}>
              <CardContent className={classes.quoteCardContent}>
                <div dangerouslySetInnerHTML={{ __html: quote?.content?.rendered }} />
                <div dangerouslySetInnerHTML={{ __html: quote?.title?.rendered }} className={classes.quoteAuthor} />
              </CardContent>
              <span className={classes.reactionDate}>{new Date(quote.date).toLocaleDateString("en-US")}</span>
              <span role="img" aria-label="reaction" className={classes.reaction}>{reactions[quote?.reaction]} </span>
            </Card>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
