import {
  makeStyles,
  Slider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { GeneticoContext } from "../logic/GeneticoContext";
import Solucao from "../Models/Solucao";

const useStyle = makeStyles((theme) => ({
  table: {
    maxHeight: "580px",
    overflow: 'auto'
  }
}));

export default function SolucoesGen() {
  const classes = useStyle();
  const { resultado, config } = useContext(GeneticoContext);
  const [idxGeracao, setidxGeracao] = useState(config.tamGeracoes);

  const handleSlider = (event, number) => {
    setidxGeracao(number);
  };

  const existeGeracao = () => resultado && resultado.length > 0 && resultado[0];

  const renderSlider = () => (
    <>
      <Typography id="geracoesLbl" gutterBottom>
        Geração
      </Typography>
      <Slider
        min={1}
        step={1}
        max={config.tamGeracoes}
        value={idxGeracao}
        onChange={handleSlider}
        valueLabelDisplay="auto"
        aria-labelledby="geracoesLbl"
      />
    </>
  );

  const renderGeracao = () => {
    const geracao: Solucao[] = resultado[idxGeracao - 1];

    return (
      <>
        <TableContainer component={Paper} className={classes.table}>
          <Table size="small">
            <TableHead>
              <TableCell>Index</TableCell>
              <TableCell>Aptidão</TableCell>
              <TableCell>Solução</TableCell>
            </TableHead>
            <TableBody>
              {geracao.length &&
                geracao.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.aptidao}</TableCell>
                    <TableCell>{row.comandos}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <>
      <Typography variant="h6">Gerações</Typography>
      {existeGeracao() && renderSlider()}
      {existeGeracao() && renderGeracao()}
    </>
  );
}
