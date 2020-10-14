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
import React, { useContext, useEffect, useState } from "react";
import { GeneticoContext } from "../logic/GeneticoContext";
import Solucao from "../Models/Solucao";

const useStyle = makeStyles((theme) => ({
  table: {
    maxHeight: "580px",
    overflow: "auto",
  },
  teste: {
    color: "red",
  },
  teste2: {
    color: "green",
  },
}));

export default function SolucoesGenetico() {
  const classes = useStyle();
  const { resultado, config } = useContext(GeneticoContext);
  const [idxGeracao, setidxGeracao] = useState(config.tamGeracoes);

  useEffect(() => {
    setidxGeracao(config.tamGeracoes);
  }, [config.tamGeracoes]);

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
              <TableRow>
                <TableCell>Index</TableCell>
                <TableCell>Aptidão</TableCell>
                <TableCell>Solução</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {geracao?.length &&
                geracao.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.aptidao}</TableCell>
                    <TableCell>
                      {row.comandos.map((e, i) => (
                        <span
                          className={
                            row.idxComandosFinal === i
                              ? classes.teste2
                              : row.idxComandosFalhos.includes(i)
                              ? classes.teste
                              : ""
                          }
                        >
                          {e}
                        </span>
                      ))}
                    </TableCell>
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
