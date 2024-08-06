import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
} from "@mui/material";

const InventoryItem = ({ item, onIncrement, onDecrement, onDelete }) => (
  <Box variant="outlined" sx={{ maxWidth: 345, bgcolor: "#778da9" }}>
    <CardContent>
      <Typography gutterBottom variant="h4" component="div" color="#eddea4">
        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
      </Typography>
      <Typography variant="h6" color="#d8e2dc">
        Quantity: {item.quantity}
      </Typography>
    </CardContent>
    <CardActions>
      <Button
        color="secondary"
        variant="contained"
        size="small"
        onClick={() => onDecrement(item.id)}
      >
        -
      </Button>
      <Button
        color="secondary"
        variant="contained"
        size="small"
        onClick={() => onIncrement(item.id)}
      >
        +
      </Button>
      <Button
        color="error"
        variant="outlined"
        size="small"
        onClick={() => onDelete(item.id)}
      >
        Delete
      </Button>
    </CardActions>
  </Box>
);

export default InventoryItem;
