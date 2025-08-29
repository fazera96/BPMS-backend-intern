const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

// If you still develop locally, allow localhost in dev only
if (process.env.NODE_ENV !== "production") {
  const cors = require("cors");
  app.use(cors({ origin: ["http://localhost:4200", "http://localhost"] }));
}

// Trust proxy so req.ip works behind Nginx
app.set("trust proxy", true);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

// db.sequelize.sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bpms application." });
});

// Health check (handy for uptime monitors / load balancers)
app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

require("./app/routes/account.routes")(app);
require("./app/routes/jobSpecs.routes")(app);
require("./app/routes/mechanicalDesign.routes")(app);
require("./app/routes/purchaseRequisition.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
