import {
  Button,
  Divider,
  makeStyles,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { GeneticoContext } from "../logic/GeneticoContext";
import { GeneticoConfig } from "../Models/Configs";

const useStyle = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "95%",
    },
  },
  button: {
    margin: theme.spacing(1),
    width: "95%",
  },
}));

export default function ConfigGen() {
  const classes = useStyle();

  const { config, setConfig, running, run } = useContext(GeneticoContext);
  const [configAtual, setConfigAtual] = useState<GeneticoConfig>(config);

  const salvarConfigs = () => {
    setConfig((state: GeneticoConfig) => {
      return { ...state, ...configAtual };
    });
  };

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setConfigAtual((state) => {
      return { ...state, [name]: Number(value) };
    });
  };

  const onChangeSlider = (number: number | number[], name: string) => {
    setConfigAtual((state) => {
      return { ...state, [name]: Number(number) };
    });
  };

  const renderInput = (name: string, label: string) => (
    <TextField
      id={name}
      name={name}
      label={label}
      type="number"
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
      defaultValue={configAtual[name]}
      onChange={onChange}
      disabled={Boolean(running)}
    />
  );

  const renderSlider = (name: string, label: string, max: number) => (
    <>
      <Typography id={`${name}Lbl`} gutterBottom>
        {label}
      </Typography>
      <Slider
        step={1}
        min={1}
        max={max}
        valueLabelDisplay="auto"
        value={configAtual[name]}
        aria-labelledby={`${name}Lbl`}
        onChange={(e, n) => onChangeSlider(n, name)}
        disabled={Boolean(running)}
      />
    </>
  );

  return (
    <div className={classes.root}>
      <Typography variant="h6">Configurações de Solução </Typography>
      <>
        {renderInput("tamSolucao", "Tamanho das Soluções")}
        {renderInput("tamGeracoes", "Tamanho das Gerações")}
        {renderInput("tamPopulacao", "Tamanho das Populações")}
      </>
      <Divider />
      <>
        <Typography variant="h6">Configurações de Mutação </Typography>
        {renderSlider(
          "taxaMutacao",
          "Taxa de Mutação",
          configAtual.tamGeracoes
        )}
        {renderSlider(
          "qntMutacoes",
          "Quantidade de Soluções Mutadas",
          configAtual.tamPopulacao
        )}
        {renderSlider(
          "tamMutacoes",
          "Intensidade das Mutações",
          configAtual.tamSolucao
        )}
      </>
      <Divider />
      <>
        {renderSlider(
          "pontosDeCorte",
          "Quantidade de Pontos de Corte",
          configAtual.tamSolucao / 2
        )}
      </>
      <Divider />
      <div>
        <Button
          className={classes.button}
          variant="outlined"
          onClick={salvarConfigs}
          disabled={Boolean(running)}
        >
          Salvar Configurações
        </Button>

        <Button
          className={classes.button}
          variant="outlined"
          onClick={run}
          disabled={Boolean(running)}
        >
          Executar 
        </Button>
      </div>
    </div>
  );
}
