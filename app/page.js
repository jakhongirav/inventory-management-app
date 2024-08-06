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
import { Loading } from "./components/loading";
import InventoryItem from "./components/item-cards";
// import { Auth } from "./components/auth";
// import { setLazyProp } from "next/dist/server/api-utils";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
  });
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    return () => {
      unsubscribe();
      setIsLoading(false);
    };
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
  const updateItemQuantity = async (id, increment = true) => {
    const docRef = doc(firestore, "inventory", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentQuantity = Number(docSnap.data().quantity);
      const updatedQuantity = increment
        ? currentQuantity + 1
        : currentQuantity - 1;
      await updateDoc(docRef, { quantity: updatedQuantity });
    }
  };

  const incrementItem = (id) => updateItemQuantity(id, true);
  const decrementItem = (id) => updateItemQuantity(id, false);

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
              sx={
                !isLoading
                  ? {
                      display: "grid",
                      gap: "20px",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gridTemplateRows: "auto",
                    }
                  : {
                      minHeight: 300,
                      display: "flex",
                      justifyContent: "center",
                    }
              }
            >
              {isLoading ? (
                <Loading />
              ) : (
                filteredInventory.map((item) => (
                  <InventoryItem
                    key={item.id}
                    item={item}
                    onIncrement={incrementItem}
                    onDecrement={decrementItem}
                    onDelete={removeItem}
                  />
                ))
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
    </main>
  );
}
