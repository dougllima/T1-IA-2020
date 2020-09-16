import React from "react";
import Paper from "@material-ui/core/Paper";
import { Grid } from "@material-ui/core";

type props = { matriz?: string[][] };

export default function Matriz({ matriz }: props) {
  return (
    <Paper>
      {matriz?.map((linha: string[]) => {
        return (
          <Grid container spacing={5}>
            {linha.map((celula: string) => {
              return (
                <Grid item>
                  {celula}
                </Grid>
              );
            })}
            <br />
          </Grid>
        );
      })}
    </Paper>
  );
}
