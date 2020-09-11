import { Container, Grid } from "@material-ui/core";
import React from "react";
import Matriz from "./Matriz";

export default function Home() {
  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Matriz
            matriz={[
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
              ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
            ]}
          />
        </Grid>
        <Grid item container xs={4}>
          Teste
        </Grid>
      </Grid>
    </Container>
  );
}
