import { Container, Grid, makeStyles, Paper } from "@material-ui/core";
import React, { useContext } from "react";
import { AlgGenContext } from "../logic/AlgGen";
import ConfigGen from "./ConfigGen";
import Matriz from "./Matriz";
import SolucoesGen from "./SolucoesGen";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    backgroundColor: theme.palette.background.default,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    height: "100%",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

export default function Home() {
  const classes = useStyles();
  const { labirinto } = useContext(AlgGenContext);

  return (
    <main className={classes.content}>
      <Container maxWidth="xl" className={classes.container}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Matriz matriz={labirinto?.labirinto} />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <SolucoesGen />
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              <ConfigGen />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
