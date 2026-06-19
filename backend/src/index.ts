import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth"
import checkoutRoutes from "./routes/checkout"
import adminRoutes from "./routes/admin"
import qrRoutes from "./routes/qr"

const app = express()
const PORT = process.env.PORT || 3001

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:3000"],
  credentials: true,
}))
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/qr", qrRoutes)

app.get("/", (_req, res) => {
  res.json({ name: "El Club del Pancito API", version: "1.0.0" })
})

app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`)
})
