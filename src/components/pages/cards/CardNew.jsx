import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function ActionAreaCard({ setOpenModalObra }) {
  const handleCardClick = () => {
    setOpenModalObra(true);
  };
  return (
    <Card
      sx={{
        maxWidth: 270,
        minWidth: 270,
        marginBottom: 20,
        marginBottom: 2,
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderRadius: 8,
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardContent
          style={{
            height: "350px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: "5rem", color: "#4CAF50" }}
            className="material-symbols-outlined"
          >
            add
          </span>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
