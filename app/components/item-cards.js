import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";

const InventoryItem = ({ item, onIncrement, onDecrement, onDelete }) => (
  <Card
    elevation={12}
    variant="outlined"
    sx={{ maxWidth: 345, bgcolor: "#778da9" }}
  >
    <CardMedia sx={{ height: 140 }} image="/" title={item.name} />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div" color="#e0e1dd">
        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
      </Typography>
      <Typography variant="body2" color="#e0e1dd">
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
  </Card>
);

export default InventoryItem;
