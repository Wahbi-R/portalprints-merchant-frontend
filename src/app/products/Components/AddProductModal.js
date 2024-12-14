import { useState, useEffect } from "react";
import { Modal, Box, TextField, Typography, Button, CircularProgress } from "@mui/material";
import { useAddProduct } from "@/hooks/useAddProduct";
import { useStore } from "@/context/StoreContext";

export const AddProductModal = ({ product, isModalOpen, setModalOpen, isEditing = false }) => {
  const { addProduct, isLoading: isAddingProduct } = useAddProduct();
  const { storeName: storeDomain } = useStore();
  const [fields, setFields] = useState({
    name: product.name ?? "",
    description: product.description ?? "",
    margin: product.margin ?? 0.00, // TODO:
  });

  useEffect(() => {
    setFields(() => {
      return {
        name: product.name ?? "",
        description: product.description ?? "",
        margin: product.margin ?? 0.00,
      };
    });
  }, [product]);

  const onFieldChange = (event) => (
    setFields(currentFields => {
      return {
        ...currentFields,
        [event.target.name]: event.target.value
      }
    })
  );

  const onSubmit = () => {
    console.log("fields", fields);
    addProduct({
      ...fields,
      storeDomain,
      product,
    })
      .then(product => {
        console.log("Product created", product);
        setModalOpen(false);
        // TODO: Trigger product refresh
      })
      .catch(e => {
        // create a toast to let the user know something went wrong
      });
      
  }

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setModalOpen(false)}
      className="flex overflow-y-scroll"
      // style={{ top: "50%", left: "50%", position: "absolute", width: "100%" }}
    >
      <Box className="bg-white flex flex-col gap-5">
        <Typography>
          Adding {product.name} to store
        </Typography>

        <TextField
          label="Name"
          name="name"
          // value={fields["name"]} 
          onChange={onFieldChange}
          defaultValue={product.name}
        />

        <TextField
          label="Margin (%)"
          name="margin"
          type="number"
          // value={fields["name"]} 
          onChange={onFieldChange}
          // defaultValue={product.margin}
        />

        <TextField
          label="Description"
          name="description"
          multiline
          onChange={onFieldChange}
          defaultValue={product.description}
          
        />

        <Button
          disabled={isAddingProduct === true}
          onClick={onSubmit}
        >
          {
            isAddingProduct
              ? <CircularProgress />
              : (isEditing ? "Update product" : "Add to store")
          }
        </Button>
      </Box>
    </Modal>
  );
};
