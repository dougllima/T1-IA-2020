import { Button, Container, Grid } from "@material-ui/core";
import React, { useContext } from "react";
import { AlgGenContext } from "../logic/AlgGen";
import Matriz from "./Matriz";

export default function Home() {
  const { labirinto, run } = useContext(AlgGenContext);

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Matriz matriz={labirinto?.labirinto} />
        </Grid>
        <Grid item container xs={4}>
          <Button onClick={run} variant="text" color="default">
            Run
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
