import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { HelpOutline } from "@material-ui/icons";
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
  select: {
    margin: theme.spacing(1),
    width: "95%",
  },
}));

const configInputs = {
  tamGeracoes: {
    title: "Quantidade de Gerações",
    tooltip: "Gerações a serem executadas",
  },
  tamPopulacao: {
    title: "Tamanho das Populações",
    tooltip: "Soluções por população",
  },
  tamSolucao: {
    title: "Tamanho das Soluções",
    tooltip: "Movimentos por solução.",
  },
  taxaMutacao: {
    title: "Taxa de Mutação",
    tooltip: "Intervalo de gerações entre as mutações.",
  },
  qntMutacoes: {
    title: "Quantidade de Soluções Mutadas",
    tooltip: "Soluções selecionadas para sofrer mutação.",
  },
  tamMutacoes: {
    title: "Intensidade das Mutações",
    tooltip:
      "Movimentos selecionados para sofrer mutação dentro de uma solução mutada.",
  },
  pontosDeCorte: {
    title: "Quantidade de Pontos de Corte",
    tooltip: "Pontos de corte para o cruzamento",
  },
};

export default function ConfigGenetico() {
  const classes = useStyle();

  const { config, setConfig, running } = useContext(GeneticoContext);
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

  const renderInput = (name: string) => (
    <TextField
      id={name}
      name={name}
      label={configInputs[name].title}
      type="number"
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
      defaultValue={configAtual[name]}
      onChange={onChange}
      disabled={Boolean(running)}
      InputProps={{
        endAdornment: (
          <Tooltip title={configInputs[name].tooltip}>
            <HelpOutline />
          </Tooltip>
        ),
      }}
    />
  );

  const renderSlider = (name: string, max: number) => (
    <>
      <Typography id={`${name}Lbl`} gutterBottom>
        {configInputs[name].title + " "}
        <Tooltip title={configInputs[name].tooltip}>
          <HelpOutline />
        </Tooltip>
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
      <Typography variant="h6">Configurações de Algoritmo </Typography>
      <FormControl className={classes.select}>
        <InputLabel id="label-aptidao">
          Função de Aptidão{" "}
          <Tooltip
            title={
              <ul>
                <li>Função Simples: Ignora movimentos impossíveis.</li>
                <br/>
                <li>Função Intermediaria: Movimentos impossíveis encerram a solução e penalizam a aptidão.</li>
                <br/>
                <li>Função Refinada: Ignora movimentos impossíveis, mas eles penalizam a solução. Soluções que terminam em menos moviemntos são priorizadas. </li>
              </ul>
            }
          >
            <HelpOutline />
          </Tooltip>
        </InputLabel>
        <Select
          labelId="label-aptidao"
          value={configAtual.funcAptidao}
          name="funcAptidao"
          onChange={onChange}
        >
          <MenuItem value={0}>Função Simples</MenuItem>
          <MenuItem value={1}>Função Intermediaria</MenuItem>
          <MenuItem value={2}>Função Refinada</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="h6">Configurações de Solução </Typography>
      <>
        {renderInput("tamSolucao")}
        {renderInput("tamGeracoes")}
        {renderInput("tamPopulacao")}
      </>
      <Divider />
      <>
        <Typography variant="h6">Configurações de Mutação </Typography>
        {renderSlider("taxaMutacao", configAtual.tamGeracoes)}
        {renderSlider("qntMutacoes", configAtual.tamPopulacao - 1)}
        {renderSlider("tamMutacoes", configAtual.tamSolucao)}
      </>
      <Divider />
      <>{renderSlider("pontosDeCorte", configAtual.tamSolucao / 2)}</>
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
      </div>
    </div>
  );
}
