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
    <main>
      <Container>
        <Box bgcolor={"#1b263b"}>
          {/* Search Field */}
          <TextField
            label="Search Items"
            value={searchText}
            placeholder="Item..."
            onChange={(e) => setSearchText(e.target.value)}
            focused
            fullWidth
            sx={{
              my: 2,
              "& .MuiInputBase-input": {
                color: "#fefae0",
              },
              "&::placeholder": {
                color: "#fefae0",
              },
            }}
          />

          {/* Adding new Item */}
          <Box>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "#cad2c5",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  fontWeight={600}
                  color={"#b56576"}
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
                    sx={{
                      fontWeight: "600",
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            </Modal>
            <Button variant="contained" fullWidth onClick={handleOpen}>
              Add New Item
            </Button>
          </Box>
          {/* Cards */}
          <Box border={"1px solid #333"} p={"20px"} mt={4}>
            <Box
              textAlign={"center"}
              bgcolor={"#415a77"}
              p={"20px"}
              mb={"20px"}
            >
              <Typography variant="h5" color={"#e0e1dd"}>
                Inventory Items
              </Typography>
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
