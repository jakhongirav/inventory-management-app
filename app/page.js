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
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@mui/material";
import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { Auth } from "./components/auth";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
  });
  const [searchText, setSearchText] = useState("");

  //! Add item to database
  const addItem = async () => {
    if (
      newItem.name !== "" &&
      newItem.quantity !== "" &&
      newItem.quantity.charAt(0) !== "0"
    ) {
      try {
        const docRef = await addDoc(collection(firestore, "inventory"), {
          name: newItem.name.trim(),
          quantity: newItem.quantity.trim(),
        });

        setInventory([...inventory, { ...newItem, id: docRef.id }]);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
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
    try {
      await deleteDoc(doc(firestore, "inventory", id));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  //! Arithmetic operations for items quantity
  const incrementItem = async (id) => {
    const docRef = doc(firestore, "inventory", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity;
      const updatedQuantity = Number(currentQuantity);
      await updateDoc(docRef, { quantity: updatedQuantity + 1 });
      console.log("Quantity updated to:", updatedQuantity);
    }
  };

  const decrementItem = async (id) => {
    const docRef = doc(firestore, "inventory", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity;
      const updatedQuantity = Number(currentQuantity);
      await updateDoc(docRef, { quantity: updatedQuantity - 1 });
      console.log("Quantity updated to:", updatedQuantity);
    }
  };

  //! Filter items based on search text
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <main
      style={{
        backgroundColor: "#0d1b2a",
        height: "100vh",
      }}
    >
      <Container>
        <Box bgcolor={"#1b263b"}>
          <Box>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 1 }}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  color={"#e0e1dd"}
                >
                  Add Item
                </Typography>
                <Stack spacing={2}>
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
                      addItem();
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
            fullWidth
            sx={{ mt: 2 }}
          />
          {/* Cards */}
          <Box border={"1px solid #333"} p={"20px"} mt={4}>
            <Box
              textAlign={"center"}
              bgcolor={"#415a77"}
              p={"20px"}
              mb={"20px"}
            >
              <Typography color={"#e0e1dd"}>Inventory Items</Typography>
            </Box>
            <Stack
              sx={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "1fr 1fr 1fr",
                gridTemplateRows: "auto",
              }}
            >
              {filteredInventory.map((item) => (
                <Card
                  key={item.id}
                  elevation={12}
                  variant="outlined"
                  sx={{ maxWidth: 345, bgcolor: "#778da9" }}
                >
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/"
                    title="jakhongirav"
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      color="#e0e1dd"
                    >
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
                      onClick={() => decrementItem(item.id)}
                    >
                      -
                    </Button>
                    <Button
                      color="secondary"
                      variant="contained"
                      size="small"
                      onClick={() => incrementItem(item.id)}
                    >
                      +
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      size="small"
                      onClick={() => removeItem(item.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </main>
  );
}
