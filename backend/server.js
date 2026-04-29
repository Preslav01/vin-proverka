import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// IMPORTANT: Node 18+ has fetch built-in. If not, install node-fetch.

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "VIN Proverka <onboarding@resend.dev>";
const LEAD_TO_EMAIL = process.env.LEAD_TO_EMAIL || "preslav.petrov06@gmail.com";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, "..", "dist");

try {
  console.log("Building frontend before starting server...");
  execSync("npm run build", {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
  });
  console.log("Frontend build completed.");
} catch (error) {
  console.error("Frontend build failed:", error.message);
}

app.use(cors());
app.use(express.json());

// =========================
// Auction API (old one)
// =========================
app.get("/api/auction-report/:vin", async (req, res) => {
  const { vin } = req.params;

  try {
    console.log("VIN:", vin);
    console.log("API KEY:", process.env.CARDATABASES_API_KEY);

    const response = await fetch(
      `https://api.vehicledatabases.com/v1/auction/records?vin=${vin}`,
      {
        headers: {
          "x-api-key": process.env.CARDATABASES_API_KEY,
          "Ocp-Apim-Subscription-Key": process.env.CARDATABASES_API_KEY,
        },
      }
    );

    console.log("STATUS:", response.status);

    const data = await response.json();

    console.log("API RESPONSE:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Auction API върна грешка.",
        status: response.status,
        details: data,
      });
    }

    res.json(data);
  } catch (error) {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
      error: "Грешка при зареждане на auction report.",
      details: error.message,
    });
  }
});

// =========================
// MarketCheck API
// =========================
app.get("/api/marketcheck/:vin", async (req, res) => {
  const { vin } = req.params;

  try {
    console.log("MarketCheck VIN:", vin);

    const response = await fetch(
      `https://mc-api.marketcheck.com/v2/search/car/active?api_key=${process.env.MARKETCHECK_API_KEY}&vin=${vin}`
    );

    console.log("MarketCheck STATUS:", response.status);

    const data = await response.json();

    console.log("MarketCheck RESPONSE:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "MarketCheck API error",
        status: response.status,
        details: data,
      });
    }

    res.json(data);
  } catch (error) {
    console.error("MarketCheck ERROR:", error);

    res.status(500).json({
      error: "MarketCheck server error",
      details: error.message,
    });
  }
});

// =========================
// MarketCheck VIN Decode test
// =========================
app.get("/api/marketcheck-decode/:vin", async (req, res) => {
  const { vin } = req.params;

  try {
    console.log("MarketCheck Decode VIN:", vin);

    const response = await fetch(
      `https://mc-api.marketcheck.com/v2/decode/car/${vin}/specs?api_key=${process.env.MARKETCHECK_API_KEY}`
    );

    console.log("MarketCheck Decode STATUS:", response.status);

    const data = await response.json();

    console.log("MarketCheck Decode RESPONSE:", data);

    res.status(response.status).json(data);
  } catch (error) {
    console.error("MarketCheck Decode ERROR:", error);

    res.status(500).json({
      error: "MarketCheck decode server error",
      details: error.message,
    });
  }
});

// =========================
// RapidAPI Vehicle Auction API
// =========================
app.get("/api/auction/:vin", async (req, res) => {
  const { vin } = req.params;

  try {
    console.log("RapidAPI Auction VIN:", vin);
    console.log("RapidAPI key exists:", Boolean(process.env.RAPID_API_KEY));

    const response = await fetch(
      `https://vehicle-auction-data-api-copart-iaai.p.rapidapi.com/vehicles/${vin}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "vehicle-auction-data-api-copart-iaai.p.rapidapi.com",
        },
      }
    );

    console.log("RapidAPI Auction STATUS:", response.status);

    const data = await response.json();
    console.log("RapidAPI Auction RESPONSE:", data);

    res.status(response.status).json(data);
  } catch (error) {
    console.error("RapidAPI Auction ERROR:", error);

    res.status(500).json({
      error: "RapidAPI auction server error",
      details: error.message,
    });
  }
});


app.post("/api/expert-request", async (req, res) => {
  try {
    const { vin, name, contact, vehicle, auctionReport, language } =
      req.body || {};

    if (!vin) {
      return res.status(400).json({
        ok: false,
        error: "VIN is required",
      });
    }

    const request = {
      vin,
      name: name || "",
      contact: contact || "",
      language: language || "bg",
      vehicle: vehicle
        ? {
            make: vehicle.Make || "",
            model: vehicle.Model || "",
            year: vehicle.ModelYear || "",
          }
        : null,
      auction: auctionReport
        ? {
            platform: auctionReport.platform || "",
            lot: auctionReport.lot_number || "",
            damage: auctionReport.condition?.primary_damage || "",
            document: auctionReport.sale_document?.name || "",
            current_bid_usd: auctionReport.pricing?.current_bid_usd || null,
            buy_now_usd: auctionReport.pricing?.buy_now_usd || null,
          }
        : null,
      createdAt: new Date().toISOString(),
    };

    console.log("=========================");
    console.log("NEW EXPERT VIN REQUEST");
    console.log(JSON.stringify(request, null, 2));
    console.log("=========================");

    let emailSent = false;
    let emailError = null;

    if (RESEND_API_KEY) {
      const subject = `New expert VIN request - ${vin}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 720px; margin: 0 auto; color: #0f172a;">
          <h1 style="margin-bottom: 8px;">New expert VIN request</h1>
          <p style="margin-top: 0; color: #475569;">A new lead was submitted from VIN Проверка.</p>

          <h2>Client</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold;">Name</td><td>${request.name || "N/A"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Contact</td><td>${request.contact || "N/A"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Language</td><td>${request.language}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Created at</td><td>${request.createdAt}</td></tr>
          </table>

          <h2>Vehicle</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold;">VIN</td><td>${request.vin}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Vehicle</td><td>${request.vehicle ? `${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}` : "N/A"}</td></tr>
          </table>

          <h2>Auction</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold;">Platform</td><td>${request.auction?.platform || "N/A"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Lot</td><td>${request.auction?.lot || "N/A"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Damage</td><td>${request.auction?.damage || "N/A"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Document</td><td>${request.auction?.document || "N/A"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Current bid</td><td>${request.auction?.current_bid_usd ? `$${request.auction.current_bid_usd}` : "N/A"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Buy now</td><td>${request.auction?.buy_now_usd ? `$${request.auction.buy_now_usd}` : "N/A"}</td></tr>
          </table>
        </div>
      `;

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: [LEAD_TO_EMAIL],
          subject,
          html,
          reply_to: request.contact && request.contact.includes("@") ? request.contact : undefined,
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        emailError = emailData;
        console.error("Resend lead email error:", emailData);
      } else {
        emailSent = true;
        console.log("Resend lead email sent:", emailData);
      }

      const clientEmail = request.contact && request.contact.includes("@")
        ? request.contact.trim()
        : null;

      if (clientEmail) {
        const clientSubject =
          request.language === "en"
            ? `We received your VIN request - ${vin}`
            : `Получихме VIN заявката ти - ${vin}`;

        const clientHtml =
          request.language === "en"
            ? `
              <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #0f172a;">
                <h1 style="margin-bottom: 8px;">We received your VIN request</h1>
                <p style="color: #475569; line-height: 1.6;">
                  Thanks for submitting your VIN for expert analysis. We will review the available vehicle and auction data and contact you to confirm the next step.
                </p>

                <div style="margin: 24px 0; padding: 16px; background: #f1f5f9; border-radius: 16px;">
                  <p><strong>VIN:</strong> ${request.vin}</p>
                  <p><strong>Vehicle:</strong> ${request.vehicle ? `${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}` : "N/A"}</p>
                  <p><strong>Auction damage:</strong> ${request.auction?.damage || "N/A"}</p>
                  <p><strong>Document:</strong> ${request.auction?.document || "N/A"}</p>
                </div>

                <p style="color: #475569; line-height: 1.6;">
                  No payment has been collected yet. We will contact you before proceeding.
                </p>

                <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
                  This report does not replace a physical inspection by a qualified mechanic.
                </p>
              </div>
            `
            : `
              <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #0f172a;">
                <h1 style="margin-bottom: 8px;">Получихме VIN заявката ти</h1>
                <p style="color: #475569; line-height: 1.6;">
                  Благодарим ти, че изпрати VIN за експертен анализ. Ще прегледаме наличните данни за автомобила и аукционната история и ще се свържем с теб за следващата стъпка.
                </p>

                <div style="margin: 24px 0; padding: 16px; background: #f1f5f9; border-radius: 16px;">
                  <p><strong>VIN:</strong> ${request.vin}</p>
                  <p><strong>Автомобил:</strong> ${request.vehicle ? `${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}` : "N/A"}</p>
                  <p><strong>Щета:</strong> ${request.auction?.damage || "N/A"}</p>
                  <p><strong>Документ:</strong> ${request.auction?.document || "N/A"}</p>
                </div>

                <p style="color: #475569; line-height: 1.6;">
                  Плащане още не е извършено. Ще се свържем с теб за потвърждение преди да продължим.
                </p>

                <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
                  Докладът не заменя физически оглед от квалифициран механик.
                </p>
              </div>
            `;

        const clientEmailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: RESEND_FROM_EMAIL,
            to: [clientEmail],
            subject: clientSubject,
            html: clientHtml,
          }),
        });

        const clientEmailData = await clientEmailResponse.json();

        if (!clientEmailResponse.ok) {
          console.error("Resend client auto-reply error:", clientEmailData);
        } else {
          console.log("Resend client auto-reply sent:", clientEmailData);
        }
      } else {
        console.log("No client email detected. Auto-reply skipped.");
      }
    } else {
      console.log("RESEND_API_KEY missing. Request logged only; email not sent.");
    }

    res.json({
      ok: true,
      message: "Expert request received",
      emailSent,
      emailError,
    });
  } catch (error) {
    console.error("Expert request error:", error);

    res.status(500).json({
      ok: false,
      error: "Expert request server error",
      details: error.message,
    });
  }
});


// serve frontend
app.use(express.static(DIST_DIR));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});