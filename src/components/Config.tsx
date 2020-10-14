import { Button, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import { GeneticoContext } from "../logic/GeneticoContext";
import ConfigGenetico from "./ConfigGenetico";

const useStyle = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    width: "95%",
  },
}));

export default function Config() {
  const { run, running } = useContext(GeneticoContext);

  const classes = useStyle();

  return (
    <div>
      <ConfigGenetico />
        <Button
          className={classes.button}
          variant="outlined"
          onClick={run}
          disabled={Boolean(running)}
        >
          Executar
        </Button>
    </div>
  );
}
