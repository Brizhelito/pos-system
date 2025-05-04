import { Router, Request, Response } from "express";
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerSummary,
} from "../services/CustomerService";
import {
  CustomerCreate,
  CustomerUpdate,
  CustomerFilters,
} from "../types/Customer";

const router = Router();

// Get all customers with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const filters: CustomerFilters = {
      name: req.query.name as string,
      email: req.query.email as string,
      phone: req.query.phone as string,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
      minTotalSales: req.query.minTotalSales
        ? Number(req.query.minTotalSales)
        : undefined,
      maxTotalSales: req.query.maxTotalSales
        ? Number(req.query.maxTotalSales)
        : undefined,
    };

    const customers = await getCustomers(filters);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

// Get customer by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const customer = await getCustomerById(Number(req.params.id));
    res.json(customer);
  } catch (error) {
    res.status(404).json({ error: "Cliente no encontrado" });
  }
});

// Create new customer
router.post("/", async (req: Request, res: Response) => {
  try {
    const customerData: CustomerCreate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const newCustomer = await createCustomer(customerData);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el cliente" });
  }
});

// Update customer
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const customerData: CustomerUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const updatedCustomer = await updateCustomer(
      Number(req.params.id),
      customerData
    );
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el cliente" });
  }
});

// Delete customer
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteCustomer(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar el cliente" });
  }
});

// Get customer summary
router.get("/summary", async (req: Request, res: Response) => {
  try {
    const summary = await getCustomerSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el resumen de clientes" });
  }
});

export default router;
