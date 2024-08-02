"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  querySnapshot,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([
    // {
    //   name: "mackBook",
    //   quantity: "50",
    // },
  ]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
  });

  //! Add item to database
  const addItem = async (item) => {
    if (newItem.name !== "" && newItem.quantity !== "") {
      setInventory([...inventory, newItem]);

      await addDoc(collection(firestore, "inventory"), {
        name: newItem.name.trim(),
        quantity: newItem.quantity.trim(),
      });
    }
  };

  //! Read item to database
  useEffect(() => {
    const q = query(collection(firestore, "inventory"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let inventoryArr = [];

      querySnapshot.forEach((doc) => {
        inventoryArr.push({ ...doc.data(), id: doc.id });
      });
      setInventory(inventoryArr);
    });
  }, []);

  //! Delete item from database

  const removeItem = async (id) => {
    await deleteDoc(doc(firestore, "inventory", id));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />

            <TextField
              type="number"
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              fullWidth
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
            />

            <Button
              variant="outlined"
              onClick={() => {
                addItem(newItem);
                setNewItem({ name: "", quantity: "" });
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={"1px solid #333"}>
        <Box
          width="800px"
          height="100px"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="800px"
          minHeight="700px"
          spacing={2}
          overflow={"auto"}
          padding={"20px"}
        >
          {inventory.map((item, id) => (
            <Box
              key={id}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              paddingX={5}
            >
              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                Quantity: {item.quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
