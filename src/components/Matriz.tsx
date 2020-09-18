import React from "react";
import clsx from "clsx";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";
import CropSquareIcon from "@material-ui/icons/CropSquare";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import HomeIcon from "@material-ui/icons/Home";
import Labirinto from "../Models/Labirinto";

type props = { matriz?: string[][] };

const useStyle = makeStyles((theme) => ({
  icons: {
    [theme.breakpoints.up("xs")]: {
      fontSize: "x-large",
    },
    
    [theme.breakpoints.up("lg")]: {
      fontSize: "xxx-large",
    },
  },
  piso: {
    opacity: "0.1",
  },
}));

export default function Matriz({ matriz }: props) {
  const classes = useStyle();

  const renderCelula = (celula: string) => {
    switch (celula) {
      case Labirinto.ESPACOS.parede:
        return <StopIcon className={classes.icons} />;
      case Labirinto.ESPACOS.piso:
        return <CropSquareIcon className={clsx(classes.piso, classes.icons)} />;
      case Labirinto.ESPACOS.inicio:
        return <DirectionsRunIcon className={classes.icons} />;
      case Labirinto.ESPACOS.fim:
        return <HomeIcon className={classes.icons} />;
      default:
        return celula;
    }
  };

  return (
    <>
      <Typography variant="h6">Labirinto</Typography>
      {matriz?.map((linha: string[]) => {
        return (
          <Grid container spacing={0}>
            {linha.map((celula: string) => {
              return <Grid item>{renderCelula(celula)}</Grid>;
            })}
            <br />
          </Grid>
        );
      })}
    </>
  );
}
