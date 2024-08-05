"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Container,
} from "@mui/material";
import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
  });
  const [searchText, setSearchText] = useState("");

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

    return () => unsubscribe();
  }, []);

  //! Delete item from database
  const removeItem = async (id) => {
    await deleteDoc(doc(firestore, "inventory", id));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //! Filter items based on search text
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <main>
      <Container>
        <Box>
          <Box>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box>
                <Typography id="modal-modal-title">Add Item</Typography>
                <Stack>
                  <TextField
                    id="outlined-basic"
                    label="Item"
                    variant="outlined"
                    fullWidth
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
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
          </Box>
          <TextField
            label="Search Items"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            focused
          />
          <Box border={"1px solid #333"}>
            <Box>
              <Typography>Inventory Items</Typography>
            </Box>
            <Stack>
              {filteredInventory.map((item, id) => (
                <Box key={id}>
                  <Typography>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </main>
  );
}
