import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Car,
  FileText,
  CheckCircle2,
  Camera,
  Gauge,
  Database,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./App.css";

const Card = ({ className = "", children }) => (
  <div className={className}>{children}</div>
);

const CardContent = ({ className = "", children }) => (
  <div className={className}>{children}</div>
);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const trackEvent = (eventName, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
};

export default function App() {
  const [vin, setVin] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [auctionReport, setAuctionReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const [galleryIndex, setGalleryIndex] = useState(null);

  const [requestName, setRequestName] = useState("");
  const [requestContact, setRequestContact] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [requestStatus, setRequestStatus] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  const [language, setLanguage] = useState("bg");

  const copy = {
    bg: {
      brand: "VIN Проверка",
      navCheck: "Провери VIN",
      badge: "История на автомобили от САЩ и Канада",
      heroTitle: "Провери фактите, преди да купиш колата.",
      heroText:
        "Въведи VIN и получи реални технически данни. Ако има налична auction информация, ще видиш щети, title статус, снимки и основни рискове.",
      heroTrustBadges: [
        "✔ Реални auction данни",
        "✔ Проверка за щети и salvage",
        "✔ Спести хиляди €",
      ],
      trustNhtsa: "Данни от NHTSA",
      trustAuctions: "Copart / IAAI auction данни",
      trustPhotos: "Реални auction снимки",
      inputPlaceholder: "Въведи VIN номер",
      submitIdle: "Провери VIN",
      submitLoading: "Проверяваме...",
      cardEyebrow: "Какво ще показва докладът",
      cardTitle: "Реални данни по VIN",
      free: "Безплатно",
      whenAvailable: "При налични данни",
      makeModel: "Марка и модел",
      yearEngine: "Година и двигател",
      auctionPhotos: "Аукционни снимки",
      damageTitle: "Щети и title статус",
      reportLabel: "VIN доклад",
      technicalData: "Технически данни",
      vehicleAnalysis: "Анализ на автомобила",
      finalDecision: "Финално решение",
      status: "Статус",
      downloadPdf: "Изтегли PDF доклад",
      requestExpert: "Вземи експертен анализ (€9.99)",
      requestExpertHint: "Отговор до 24 часа. Без плащане преди потвърждение.",
      vinRecognized: "VIN разпознат",
      auctionFound: "Auction данни: намерени",
      auctionNotFound: "Auction данни: няма намерени",
      noData: "Няма данни",
      yes: "Да",
      no: "Не",
      notReported: "Не е отчетен",
      vinInvalid: "VIN номерът не беше разпознат или е непълен.",
      genericError: "Възникна грешка при проверката. Опитай отново.",
      vehicleRecognizedPrefix: "Автомобилът е разпознат успешно по VIN като",
      analysisDescription:
        "Докладът комбинира технически VIN данни с налична auction информация, когато такава бъде намерена. Данните не заменят физически оглед, но помагат да разбереш основните рискове преди покупка.",
      riskScore: "Оценка на риска",
      lowRisk: "Нисък риск",
      mediumRisk: "Среден риск",
      highRisk: "Висок риск",
      lowRiskHint: "ако няма щети и чиста история",
      mediumRiskHint: "ако има ремонтируеми щети",
      highRiskHint: "при salvage, flood или тежки щети",
      currentStatus: "Текущ статус",
      needMoreCheck: "Нужна е допълнителна проверка",
      needMoreCheckText:
        "VIN-ът е разпознат, но няма налични auction/title данни за категорична оценка.",
      avoid: "Не купувай",
      floodText:
        "Има индикация за flood риск. Такъв автомобил е високорисков и не е подходящ без изключително задълбочена проверка.",
      highRiskExpert: "Висок риск — само след експертен оглед",
      salvageDamageText: (saleDocument, primaryDamage) =>
        `Документът е “${saleDocument}”, а основната щета е “${primaryDamage}”. Покупка има смисъл само при много добра цена и доказан качествен ремонт.`,
      salvageText: (saleDocument) =>
        `Открит е salvage/title статус: “${saleDocument}”. Това значително влияе на стойността и препродажбата.`,
      beCareful: "Внимавай",
      damageText: (primaryDamage) =>
        `Открита е щета: “${primaryDamage}”. Провери качеството на ремонта, носещата конструкция и съответствието с цената.`,
      inspectionNeeded: "Нужен е оглед",
      unknownRunText:
        "Няма потвърдена информация дали автомобилът се движи. Направи оглед преди решение.",
      potentiallyGood: "Потенциално добра",
      potentiallyGoodText:
        "В наличните auction данни не се вижда сериозен проблем, но физически оглед остава задължителен.",
      noAnalysisData: "Няма достатъчно данни за анализ.",
      missingAuctionIssue: "Липсват auction/title данни за пълна оценка.",
      primaryDamageIssue: (value) => `Основна щета: ${value}.`,
      secondaryDamageIssue: (value) => `Допълнителна щета: ${value}.`,
      titleDocumentIssue: (value) => `Title/document статус: ${value}.`,
      floodIssue: "Възможен flood риск.",
      noKeyIssue: "Автомобилът е отбелязан без ключ.",
      unknownRunIssue: "Състоянието на движение е неизвестно.",
      odometerMissingIssue: "Километражът не е отчетен в auction данните.",
      highRiskSummary:
        "Наличните данни показват висок риск. Покупката е оправдана само след експертен оглед, проверка на ремонта и много добра цена.",
      mediumRiskSummary:
        "Има рискови фактори, които трябва да се проверят преди покупка. Препоръчва се сервизен оглед и сравнение с пазарната стойност.",
      lowRiskSummary:
        "На база наличните данни рискът изглежда по-нисък, но физически оглед остава препоръчителен.",
      make: "Марка",
      model: "Модел",
      year: "Година",
      bodyType: "Тип купе",
      engine: "Двигател",
      displacement: "Обем (L)",
      cylinders: "Цилиндри",
      fuel: "Гориво",
      drive: "Задвижване",
      transmission: "Трансмисия",
      electrification: "Електрификация",
      manufacturer: "Производител",
      plant: "Завод",
      country: "Държава",
      damageCard: "Щети",
      titleSalvage: "Title / Salvage",
      odometer: "Километраж",
      auctionHistory: "Аукционна история",
      condition: "Състояние",
      primaryDamage: "Основна щета",
      secondaryDamage: "Допълнителна щета",
      loss: "Loss",
      document: "Документ",
      export: "Export",
      registration: "Registration",
      pending: "Pending",
      rollbackRisk: "Rollback риск: изисква допълнителна история",
      platform: "Платформа",
      lot: "Lot",
      date: "Дата",
      currentBid: "Current bid",
      buyNow: "Buy now",
      photos: "Снимки",
      video: "Видео",
      conditionAuction: "Auction condition",
      color: "Цвят",
      requestHeading: "Заяви експертен анализ",
      requestText: "Ще подготвим експертно мнение за VIN:",
      requestTextSuffix:
        "включително преглед на щети, salvage/title статус, аукционна история, снимки, цена и основни рискове, когато са налични.",
      recommendedPrice: "Препоръчителна стартова цена",
      expertAnalysisPrice: "за експертен анализ",
      modalBenefits: [
        "✔ Реални снимки преди ремонт",
        "✔ Анализ дали си струва покупката",
        "✔ Проверка за скрити рискове",
        "✔ Препоръчителна цена",
      ],
      modalWarning:
        "⚠️ Проверявай преди да купиш — ремонтите могат да струват хиляди €",
      noPaymentYet:
        "Плащане още не се извършва — ще се свържем с теб за потвърждение.",
      namePlaceholder: "Име",
      contactPlaceholder: "Телефон или имейл",
      sendRequest: "Изпрати заявка",
      requestSending: "Изпращаме...",
      requestSuccess:
        "✅ Заявката е изпратена успешно! Ще се свържем с теб скоро.",
      requestError: "❌ Възникна грешка. Опитай отново.",
      close: "Затвори",
      galleryImage: "Снимка",
      galleryFrom: "от",
      gallerySource: "Източник: Auction data",
      open: "Отвори",
      lockedExpert: "🔒 Налично в експертен анализ",
      disclaimerTitle: "Важно уточнение",
      disclaimerText:
        "VIN Proverka използва налични публични и партньорски данни, включително VIN decoder и auction информация, когато такава е налична. Докладът не заменя физически оглед, сервизна диагностика или правна проверка на документите преди покупка.",
      disclaimerPointOne:
        "Данните могат да бъдат непълни или забавени според източника.",
      disclaimerPointTwo:
        "Винаги проверявай автомобила физически преди покупка.",
      disclaimerPointThree:
        "Експертният анализ е помощно мнение, не гаранция за състоянието на автомобила.",
      footerSourcesTitle: "Източници и доверие",
      footerSourcesText:
        "Комбинираме VIN decoder данни, публични технически данни и налична auction информация, когато такава бъде намерена.",
      footerContactTitle: "Контакт",
      footerContactText:
        "За въпроси, партньорства или експертен анализ можеш да се свържеш с нас по имейл.",
      footerEmail: "contact@vinproverka.online",
      footerLinksTitle: "Бързи връзки",
      footerCheck: "Провери VIN",
      footerReport: "Доклад",
      footerExpert: "Експертен анализ",
      footerCopyright: "Всички права запазени.",
    },
    en: {
      brand: "VIN Check",
      navCheck: "Check VIN",
      badge: "Vehicle history from the USA and Canada",
      heroTitle: "Check the facts before buying the car.",
      heroText:
        "Enter a VIN and see real technical data. If auction data is available, you will see damage, title status, photos and key risk factors.",
      heroTrustBadges: [
        "✔ Real auction data",
        "✔ Damage and salvage check",
        "✔ Avoid costly mistakes",
      ],
      trustNhtsa: "NHTSA data",
      trustAuctions: "Copart / IAAI auction data",
      trustPhotos: "Real auction photos",
      inputPlaceholder: "Enter VIN number",
      submitIdle: "Check VIN",
      submitLoading: "Checking...",
      cardEyebrow: "What the report shows",
      cardTitle: "Real VIN-based data",
      free: "Free",
      whenAvailable: "When available",
      makeModel: "Make and model",
      yearEngine: "Year and engine",
      auctionPhotos: "Auction photos",
      damageTitle: "Damage and title status",
      reportLabel: "VIN report",
      technicalData: "Technical data",
      vehicleAnalysis: "Vehicle analysis",
      finalDecision: "Final decision",
      status: "Status",
      downloadPdf: "Download PDF report",
      requestExpert: "Get expert analysis (€9.99)",
      requestExpertHint:
        "Response within 24 hours. No payment before confirmation.",
      vinRecognized: "VIN recognized",
      auctionFound: "Auction data found",
      auctionNotFound: "No auction data found",
      noData: "No data",
      yes: "Yes",
      no: "No",
      notReported: "Not reported",
      vinInvalid: "The VIN was not recognized or is incomplete.",
      genericError: "An error occurred during the check. Please try again.",
      vehicleRecognizedPrefix:
        "The vehicle was successfully identified by VIN as",
      analysisDescription:
        "The report combines technical VIN data with available auction information when found. The data does not replace a physical inspection, but helps you understand the main risks before buying.",
      riskScore: "Risk score",
      lowRisk: "Low risk",
      mediumRisk: "Medium risk",
      highRisk: "High risk",
      lowRiskHint: "if there is no damage and the history is clean",
      mediumRiskHint: "if there is repairable damage",
      highRiskHint: "for salvage, flood or severe damage",
      currentStatus: "Current status",
      needMoreCheck: "Additional verification needed",
      needMoreCheckText:
        "The VIN is recognized, but there is no available auction/title data for a confident decision.",
      avoid: "Avoid",
      floodText:
        "There is an indication of flood risk. This type of vehicle is high-risk and should not be considered without a very thorough inspection.",
      highRiskExpert: "High risk — expert inspection required",
      salvageDamageText: (saleDocument, primaryDamage) =>
        `The document is “${saleDocument}” and the primary damage is “${primaryDamage}”. Buying only makes sense at a very strong price and with verified repair quality.`,
      salvageText: (saleDocument) =>
        `A salvage/title status was found: “${saleDocument}”. This significantly affects value and resale potential.`,
      beCareful: "Be careful",
      damageText: (primaryDamage) =>
        `Damage was found: “${primaryDamage}”. Check repair quality, structural components and price justification.`,
      inspectionNeeded: "Inspection needed",
      unknownRunText:
        "There is no confirmed information whether the vehicle runs. Inspect it before making a decision.",
      potentiallyGood: "Potentially good",
      potentiallyGoodText:
        "No serious issue is visible in the available auction data, but a physical inspection is still required.",
      noAnalysisData: "There is not enough data for analysis.",
      missingAuctionIssue:
        "Auction/title data is missing for a full assessment.",
      primaryDamageIssue: (value) => `Primary damage: ${value}.`,
      secondaryDamageIssue: (value) => `Secondary damage: ${value}.`,
      titleDocumentIssue: (value) => `Title/document status: ${value}.`,
      floodIssue: "Possible flood risk.",
      noKeyIssue: "The vehicle is marked as having no key.",
      unknownRunIssue: "Run condition is unknown.",
      odometerMissingIssue: "Odometer is not reported in the auction data.",
      highRiskSummary:
        "The available data indicates high risk. Purchase is justified only after expert inspection, repair verification and a very strong price.",
      mediumRiskSummary:
        "There are risk factors that should be checked before buying. A workshop inspection and market value comparison are recommended.",
      lowRiskSummary:
        "Based on the available data, the risk appears lower, but a physical inspection is still recommended.",
      make: "Make",
      model: "Model",
      year: "Year",
      bodyType: "Body type",
      engine: "Engine",
      displacement: "Displacement (L)",
      cylinders: "Cylinders",
      fuel: "Fuel",
      drive: "Drive",
      transmission: "Transmission",
      electrification: "Electrification",
      manufacturer: "Manufacturer",
      plant: "Plant",
      country: "Country",
      damageCard: "Damage",
      titleSalvage: "Title / Salvage",
      odometer: "Odometer",
      auctionHistory: "Auction history",
      condition: "Condition",
      primaryDamage: "Primary damage",
      secondaryDamage: "Secondary damage",
      loss: "Loss",
      document: "Document",
      export: "Export",
      registration: "Registration",
      pending: "Pending",
      rollbackRisk: "Rollback risk: requires additional history",
      platform: "Platform",
      lot: "Lot",
      date: "Date",
      currentBid: "Current bid",
      buyNow: "Buy now",
      photos: "Photos",
      video: "Video",
      conditionAuction: "Auction condition",
      color: "Color",
      requestHeading: "Request expert analysis",
      requestText: "We will prepare an expert opinion for VIN:",
      requestTextSuffix:
        "including damage review, salvage/title status, auction history, photos, price and key risks when available.",
      recommendedPrice: "Recommended starting price",
      expertAnalysisPrice: "for expert analysis",
      modalBenefits: [
        "✔ Real pre-repair photos",
        "✔ Analysis whether the car is worth buying",
        "✔ Hidden risk review",
        "✔ Recommended purchase price",
      ],
      modalWarning: "⚠️ Check before buying — repairs can cost thousands of €",
      noPaymentYet:
        "No payment is collected yet — we will contact you to confirm.",
      namePlaceholder: "Name",
      contactPlaceholder: "Phone or email",
      sendRequest: "Send request",
      requestSending: "Sending...",
      requestSuccess:
        "✅ Your request was sent successfully! We will contact you soon.",
      requestError: "❌ Something went wrong. Please try again.",
      close: "Close",
      galleryImage: "Image",
      galleryFrom: "of",
      gallerySource: "Source: Auction data",
      open: "Open",
      lockedExpert: "🔒 Available in expert analysis",
      disclaimerTitle: "Important disclaimer",
      disclaimerText:
        "VIN Proverka uses available public and partner data, including VIN decoder and auction information when available. The report does not replace a physical inspection, workshop diagnostics or legal document verification before purchase.",
      disclaimerPointOne:
        "Data may be incomplete or delayed depending on the source.",
      disclaimerPointTwo:
        "Always inspect the vehicle physically before buying.",
      disclaimerPointThree:
        "Expert analysis is an advisory opinion, not a guarantee of the vehicle condition.",
      footerSourcesTitle: "Sources and trust",
      footerSourcesText:
        "We combine VIN decoder data, public technical data and available auction information when found.",
      footerContactTitle: "Contact",
      footerContactText:
        "For questions, partnerships or expert analysis, you can contact us by email.",
      footerEmail: "contact@vinproverka.online",
      footerLinksTitle: "Quick links",
      footerCheck: "Check VIN",
      footerReport: "Report",
      footerExpert: "Expert analysis",
      footerCopyright: "All rights reserved.",
    },
  };

  const text = copy[language];

  const formatValue = (value, fallback = text.noData) => {
    if (value === null || value === undefined || value === "") return fallback;
    return value;
  };

  const formatBoolean = (value) => {
    if (value === true) return text.yes;
    if (value === false) return text.no;
    return text.noData;
  };

  const formatOdometer = (value, unit) => {
    if (value === null || value === undefined || value === "")
      return text.noData;
    if (Number(value) === 0) return text.notReported;
    return `${value} ${unit}`;
  };

  const auctionImages = auctionReport?.media?.items?.length
    ? auctionReport.media.items
        .filter((item) => item.type === "image")
        .map((item) => item.large || item.full || item.thumb)
        .filter(Boolean)
    : auctionReport?.media?.thumbs || [];

  const openGallery = (index = 0) => {
    if (!auctionImages.length) return;
    setGalleryIndex(index);
  };

  const closeGallery = () => setGalleryIndex(null);

  const showPreviousImage = () => {
    setGalleryIndex((currentIndex) =>
      currentIndex === 0 ? auctionImages.length - 1 : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    setGalleryIndex((currentIndex) =>
      currentIndex === auctionImages.length - 1 ? 0 : currentIndex + 1,
    );
  };

  const getDecision = () => {
    if (!auctionReport) {
      return {
        label: text.needMoreCheck,
        text: text.needMoreCheckText,
        color: "blue",
      };
    }

    const primaryDamage = auctionReport.condition?.primary_damage || "";
    const saleDocument = auctionReport.sale_document?.name || "";
    const runCondition = auctionReport.condition?.run_condition?.value || "";
    const hasSalvage = saleDocument.toLowerCase().includes("salvage");
    const hasFlood =
      primaryDamage.toLowerCase().includes("flood") ||
      saleDocument.toLowerCase().includes("flood");
    const hasDamage = Boolean(primaryDamage);

    if (hasFlood) {
      return {
        label: text.avoid,
        text: text.floodText,
        color: "red",
      };
    }

    if (hasSalvage && hasDamage) {
      return {
        label: text.highRiskExpert,
        text: text.salvageDamageText(saleDocument, primaryDamage),
        color: "red",
      };
    }

    if (hasSalvage) {
      return {
        label: text.highRisk,
        text: text.salvageText(saleDocument),
        color: "red",
      };
    }

    if (hasDamage) {
      return {
        label: text.beCareful,
        text: text.damageText(primaryDamage),
        color: "yellow",
      };
    }

    if (runCondition.toLowerCase() === "unknown") {
      return {
        label: text.inspectionNeeded,
        text: text.unknownRunText,
        color: "yellow",
      };
    }

    return {
      label: text.potentiallyGood,
      text: text.potentiallyGoodText,
      color: "green",
    };
  };

  const getRiskAnalysis = () => {
    const issues = [];
    let score = 15;

    if (!vehicle) {
      return {
        score: 0,
        level: text.noData,
        colorClass: "text-slate-500",
        bgClass: "bg-slate-100",
        summary: text.noAnalysisData,
        issues: [],
      };
    }

    if (!auctionReport) {
      score += 25;
      issues.push(text.missingAuctionIssue);
    } else {
      const primaryDamage = auctionReport.condition?.primary_damage;
      const secondaryDamage = auctionReport.condition?.secondary_damage;
      const saleDocument = auctionReport.sale_document?.name || "";
      const hasKey = auctionReport.condition?.has_key;
      const runCondition = auctionReport.condition?.run_condition?.value;
      const odometerMi = auctionReport.odometer?.mi;

      if (primaryDamage) {
        score += 20;
        issues.push(text.primaryDamageIssue(primaryDamage));
      }

      if (secondaryDamage) {
        score += 10;
        issues.push(text.secondaryDamageIssue(secondaryDamage));
      }

      if (saleDocument.toLowerCase().includes("salvage")) {
        score += 35;
        issues.push(text.titleDocumentIssue(saleDocument));
      }

      if (
        saleDocument.toLowerCase().includes("flood") ||
        String(primaryDamage).toLowerCase().includes("flood")
      ) {
        score += 35;
        issues.push(text.floodIssue);
      }

      if (hasKey === false) {
        score += 8;
        issues.push(text.noKeyIssue);
      }

      if (runCondition && runCondition.toLowerCase() === "unknown") {
        score += 5;
        issues.push(text.unknownRunIssue);
      }

      if (Number(odometerMi) === 0) {
        score += 5;
        issues.push(text.odometerMissingIssue);
      }
    }

    const finalScore = Math.min(score, 100);

    if (finalScore >= 70) {
      return {
        score: finalScore,
        level: text.highRisk,
        colorClass: "text-red-700",
        bgClass: "bg-red-100",
        summary: text.highRiskSummary,
        issues,
      };
    }

    if (finalScore >= 40) {
      return {
        score: finalScore,
        level: text.mediumRisk,
        colorClass: "text-yellow-700",
        bgClass: "bg-yellow-100",
        summary: text.mediumRiskSummary,
        issues,
      };
    }

    return {
      score: finalScore,
      level: text.lowRisk,
      colorClass: "text-green-700",
      bgClass: "bg-green-100",
      summary: text.lowRiskSummary,
      issues,
    };
  };

  const downloadPdfReport = async () => {
    if (!vehicle) return;

    trackEvent("pdf_download", {
      vin,
      make: vehicle?.Make || "",
      model: vehicle?.Model || "",
      year: vehicle?.ModelYear || "",
      has_auction_data: Boolean(auctionReport),
    });

    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    const analysis = getRiskAnalysis();
    const decision = getDecision();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("VIN Proverka Report", 14, 20);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(`VIN: ${vin}`, 14, 32);
    pdf.text(
      `Vehicle: ${vehicle.Make || "N/A"} ${vehicle.Model || "N/A"}`,
      14,
      40,
    );
    pdf.text(`Year: ${vehicle.ModelYear || "N/A"}`, 14, 48);
    pdf.text(`Body: ${vehicle.BodyClass || "N/A"}`, 14, 56);
    pdf.text(`Engine: ${vehicle.EngineModel || "N/A"}`, 14, 64);
    pdf.text(`Fuel: ${vehicle.FuelTypePrimary || "N/A"}`, 14, 72);
    pdf.text(`Plant country: ${vehicle.PlantCountry || "N/A"}`, 14, 80);

    if (auctionReport) {
      pdf.text(`Auction platform: ${auctionReport.platform || "N/A"}`, 14, 88);
      pdf.text(`Lot: ${auctionReport.lot_number || "N/A"}`, 14, 96);
      pdf.text(
        `Damage: ${auctionReport.condition?.primary_damage || "N/A"}`,
        14,
        104,
      );
      pdf.text(
        `Document: ${auctionReport.sale_document?.name || "N/A"}`,
        14,
        112,
      );
    }

    pdf.setFont("helvetica", "bold");
    const riskTitleY = auctionReport ? 128 : 96;
    pdf.text("Risk analysis", 14, riskTitleY);

    pdf.setFont("helvetica", "normal");
    const riskStartY = auctionReport ? 138 : 106;
    pdf.text(`Risk score: ${analysis.score}/100`, 14, riskStartY);

    const riskLevelForPdf =
      {
        "Няма данни": "No data",
        "Нисък риск": "Low risk",
        "Среден риск": "Medium risk",
        "Висок риск": "High risk",
      }[analysis.level] || analysis.level;

    const decisionForPdf =
      {
        "Нужна е допълнителна проверка": "Further verification needed",
        "Няма данни": "Not enough data",
        "Потенциално добра": "Potentially good",
        "Нужен е оглед": "Inspection needed",
        Внимавай: "Be careful",
        "Висок риск": "High risk",
        "Висок риск — само след експертен оглед":
          "High risk - expert inspection required",
        "Не купувай": "Avoid",
      }[decision.label] || decision.label;

    const summaryForPdf =
      analysis.level === "Висок риск"
        ? "The available data indicates high risk. Purchase only after expert inspection, repair verification and strong price justification."
        : analysis.level === "Среден риск"
          ? "There are risk factors that should be checked before purchase. Mechanical inspection and market price comparison are recommended."
          : "A full vehicle inspection is recommended before purchase.";

    pdf.text(`Risk level: ${riskLevelForPdf}`, 14, riskStartY + 8);
    pdf.text(`Decision: ${decisionForPdf}`, 14, riskStartY + 16);

    const summaryLines = pdf.splitTextToSize(summaryForPdf, 180);
    pdf.text(summaryLines, 14, riskStartY + 28);

    let y = riskStartY + 44;
    pdf.setFont("helvetica", "bold");
    pdf.text("Important notes", 14, y);
    y += 8;
    pdf.setFont("helvetica", "normal");

    const issues = analysis.issues.length
      ? analysis.issues.map((issue) =>
          issue
            .replace("Основна щета", "Primary damage")
            .replace("Допълнителна щета", "Secondary damage")
            .replace("Title/document статус", "Title/document status")
            .replace(
              "Километражът не е отчетен в auction данните.",
              "Odometer is not reported in the auction data.",
            )
            .replace(
              "Състоянието на движение е неизвестно.",
              "Run condition is unknown.",
            ),
        )
      : ["No major issues were detected in the available data."];

    issues.forEach((issue) => {
      const lines = pdf.splitTextToSize(`- ${issue}`, 180);
      pdf.text(lines, 14, y);
      y += lines.length * 7;
    });

    y += 4;
    pdf.setFont("helvetica", "bold");
    pdf.text("Disclaimer", 14, y);
    y += 8;
    pdf.setFont("helvetica", "normal");
    const disclaimer = pdf.splitTextToSize(
      "This report is generated from available VIN decoder and auction data. It does not replace a physical inspection by a qualified mechanic.",
      180,
    );
    pdf.text(disclaimer, 14, y);

    pdf.save(`vin-report-${vin}.pdf`);
  };

  const sendFullReportRequestEmail = async () => {
    setRequestStatus("");
    setRequestLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/expert-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vin,
          name: requestName,
          contact: requestContact,
          vehicle,
          auctionReport,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Request failed");
      }

      setRequestStatus("success");
      trackEvent("expert_request_submit", {
        vin,
        language,
        has_auction_data: Boolean(auctionReport),
        contact_type: requestContact.includes("@") ? "email" : "phone_or_other",
      });
      setRequestName("");
      setRequestContact("");
    } catch {
      setRequestStatus("error");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    trackEvent("vin_search", {
      vin,
      language,
    });
    setError("");
    setVehicle(null);
    setAuctionReport(null);
    setShowReport(false);

    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
      );

      const data = await response.json();
      const result = data.Results?.[0];

      if (!result || result.ErrorCode !== "0") {
        setError(text.vinInvalid);
        return;
      }

      setVehicle(result);
      setShowReport(true);

      try {
        const auctionResponse = await fetch(
          `${API_BASE_URL}/api/auction/${vin}`,
        );

        const auctionData = await auctionResponse.json();

        if (auctionResponse.ok && auctionData?.ok && auctionData?.data) {
          setAuctionReport(auctionData.data);
        } else {
          setAuctionReport(null);
        }
      } catch {
        setAuctionReport(null);
      }

      setTimeout(() => {
        document
          .getElementById("report")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError(text.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 bg-[#07111f]/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500 p-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-black">{text.brand}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 p-1 text-sm font-black">
              <button
                type="button"
                onClick={() => setLanguage("bg")}
                className={`rounded-full px-3 py-1 ${language === "bg" ? "bg-white text-slate-950" : "text-white"}`}
              >
                BG
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-3 py-1 ${language === "en" ? "bg-white text-slate-950" : "text-white"}`}
              >
                EN
              </button>
            </div>

            <a
              href="#check"
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-950"
            >
              {text.navCheck}
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-100">
              <Database className="h-4 w-4" />
              {text.badge}
            </div>

            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              {text.heroTitle}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              {text.heroText}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              {text.heroTrustBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-white/10 px-3 py-1"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
              <span>{text.trustNhtsa}</span>
              <span>•</span>
              <span>{text.trustAuctions}</span>
              <span>•</span>
              <span>{text.trustPhotos}</span>
            </div>

            <form
              id="check"
              onSubmit={handleSubmit}
              className="mt-8 rounded-3xl border border-white/10 bg-white p-3 shadow-2xl md:flex md:items-center"
            >
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  placeholder={text.inputPlaceholder}
                  required
                  minLength={8}
                  autoFocus
                  className="w-full bg-transparent py-4 text-lg font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 px-8 py-4 text-base font-black text-white hover:bg-blue-700 disabled:opacity-60 md:w-auto"
              >
                {loading ? text.submitLoading : text.submitIdle}
              </button>
            </form>

            {error && (
              <p className="mt-3 rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200">
                {error}
              </p>
            )}
          </div>

          <Card className="rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl">
            <CardContent className="p-6">
              <p className="text-sm font-bold text-blue-200">
                {text.cardEyebrow}
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                {text.cardTitle}
              </h2>

              <div className="mt-5 grid gap-3">
                {[
                  [Car, text.makeModel, text.free],
                  [Gauge, text.yearEngine, text.free],
                  [Camera, text.auctionPhotos, text.whenAvailable],
                  [FileText, text.damageTitle, text.whenAvailable],
                ].map(([Icon, title, value]) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-2xl bg-slate-950/70 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-300" />
                      <span className="font-bold">{title}</span>
                    </div>
                    <span className="text-sm text-slate-300">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {showReport && vehicle && (
          <section id="report" className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-300">
                {text.reportLabel}
              </p>
              <h2 className="break-all text-3xl font-black md:text-5xl">
                VIN: {vin}
              </h2>
            </div>

            <div className="grid items-start gap-5 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card className="rounded-3xl bg-white text-slate-950">
                  <CardContent className="p-6">
                    <h3 className="mb-5 text-2xl font-black">
                      {text.technicalData}
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Info
                        label={text.make}
                        value={vehicle.Make}
                        fallback={text.noData}
                      />
                      <Info
                        label={text.model}
                        value={vehicle.Model}
                        fallback={text.noData}
                      />
                      <Info
                        label={text.year}
                        value={vehicle.ModelYear}
                        fallback={text.noData}
                      />
                      <Info
                        label={text.bodyType}
                        value={vehicle.BodyClass}
                        fallback={text.noData}
                      />

                      <Info
                        label={text.engine}
                        value={vehicle.EngineModel}
                        fallback={text.noData}
                      />
                      <Info
                        label={text.displacement}
                        value={vehicle.DisplacementL}
                        fallback={text.noData}
                      />
                      <Info
                        label={text.cylinders}
                        value={vehicle.EngineCylinders}
                        fallback={text.noData}
                      />

                      <Info
                        label={text.fuel}
                        value={vehicle.FuelTypePrimary}
                        fallback={text.noData}
                      />
                      <Info
                        label={text.drive}
                        value={vehicle.DriveType}
                        fallback={text.noData}
                      />
                      <Info
                        label={text.transmission}
                        value={vehicle.TransmissionStyle}
                        fallback={text.noData}
                      />

                      <Info
                        label={text.electrification}
                        value={vehicle.ElectrificationLevel}
                        fallback={text.noData}
                      />
                      <Info
                        label={text.manufacturer}
                        value={vehicle.Manufacturer}
                        fallback={text.noData}
                      />

                      <Info
                        label={text.plant}
                        value={vehicle.PlantCompanyName}
                        fallback={text.noData}
                      />
                      <Info
                        label={text.country}
                        value={vehicle.PlantCountry}
                        fallback={text.noData}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-white/10 bg-white text-slate-950">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-black">
                      {text.vehicleAnalysis}
                    </h3>

                    <p className="mt-4 leading-8 text-slate-700">
                      {text.vehicleRecognizedPrefix}{" "}
                      <strong>
                        {vehicle?.Make} {vehicle?.Model} ({vehicle?.ModelYear})
                      </strong>
                      .
                    </p>

                    <p className="mt-4 leading-8 text-slate-700">
                      {text.analysisDescription}
                    </p>

                    {(() => {
                      const analysis = getRiskAnalysis();

                      return (
                        <div
                          className={`mt-5 rounded-2xl p-4 ${analysis.bgClass}`}
                        >
                          <p className={`font-black ${analysis.colorClass}`}>
                            {text.riskScore}: {analysis.level} ({analysis.score}
                            /100)
                          </p>
                          <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                            <div
                              className={`h-2 rounded-full ${
                                analysis.score >= 70
                                  ? "bg-red-500"
                                  : analysis.score >= 40
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${analysis.score}%` }}
                            />
                          </div>
                          <p className="mt-1 text-sm text-slate-600">
                            {analysis.summary}
                          </p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-white/10 bg-white text-slate-950">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-black">
                      {text.finalDecision}
                    </h3>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-green-100 p-4">
                        <p className="font-black text-green-700">
                          {text.lowRisk}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {text.lowRiskHint}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-yellow-100 p-4">
                        <p className="font-black text-yellow-700">
                          {text.mediumRisk}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {text.mediumRiskHint}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-red-100 p-4">
                        <p className="font-black text-red-700">
                          {text.highRisk}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {text.highRiskHint}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-blue-100 p-4">
                      {(() => {
                        const decision = getDecision();

                        return (
                          <>
                            <p className="font-black text-blue-700">
                              {text.currentStatus}: {decision.label}
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                              {decision.text}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-5 md:grid-cols-3">
                  <LockedCard
                    title={text.damageCard}
                    unlocked={Boolean(auctionReport)}
                    lockedText={text.lockedExpert}
                    lines={
                      auctionReport
                        ? [
                            `${text.primaryDamage}: ${formatValue(auctionReport.condition?.primary_damage, text.noData)}`,
                            `${text.secondaryDamage}: ${formatValue(auctionReport.condition?.secondary_damage, text.noData)}`,
                            `${text.loss}: ${formatValue(auctionReport.condition?.loss, text.noData)}`,
                          ]
                        : [
                            text.primaryDamage,
                            text.secondaryDamage,
                            "Structural damage",
                            "Airbags статус",
                          ]
                    }
                  />

                  <LockedCard
                    title={text.titleSalvage}
                    unlocked={Boolean(auctionReport)}
                    lockedText={text.lockedExpert}
                    lines={
                      auctionReport
                        ? [
                            `${text.document}: ${formatValue(auctionReport.sale_document?.name, text.noData)}`,
                            `${text.export}: ${formatBoolean(auctionReport.sale_document?.export)}`,
                            `${text.registration}: ${formatBoolean(auctionReport.sale_document?.registration)}`,
                            `${text.pending}: ${formatBoolean(auctionReport.sale_document?.is_pending)}`,
                          ]
                        : [
                            "Clean / Salvage / Rebuilt",
                            "Flood damage",
                            "Theft recovery",
                            "NMVTIS статус",
                          ]
                    }
                  />

                  <LockedCard
                    title={text.odometer}
                    unlocked={Boolean(auctionReport)}
                    lockedText={text.lockedExpert}
                    lines={
                      auctionReport
                        ? [
                            `Odometer miles: ${formatOdometer(auctionReport.odometer?.mi, "mi")}`,
                            `Odometer km: ${formatOdometer(auctionReport.odometer?.km, "km")}`,
                            text.rollbackRisk,
                            `Auction odometer: ${formatOdometer(auctionReport.odometer?.mi, "mi")}`,
                          ]
                        : [
                            "Последно отчетен пробег",
                            "История на километража",
                            text.rollbackRisk,
                            "Аукционен odometer",
                          ]
                    }
                  />

                  <LockedCard
                    title={text.auctionHistory}
                    unlocked={Boolean(auctionReport)}
                    lockedText={text.lockedExpert}
                    lines={
                      auctionReport
                        ? [
                            `${text.platform}: ${formatValue(auctionReport.platform, text.noData)}`,
                            `${text.lot}: ${formatValue(auctionReport.lot_number, text.noData)}`,
                            `${text.date}: ${formatValue(auctionReport.auction?.formatted, text.noData)}`,
                            `${text.currentBid}: $${auctionReport.pricing?.current_bid_usd ?? text.noData}`,
                            `${text.buyNow}: $${auctionReport.pricing?.buy_now_usd ?? text.noData}`,
                          ]
                        : [
                            "Copart / IAAI / Manheim",
                            "Дата на продажба",
                            "Крайна цена",
                            "Lot информация",
                          ]
                    }
                  />

                  <LockedCard
                    title={text.auctionPhotos}
                    unlocked={Boolean(auctionReport)}
                    lockedText={text.lockedExpert}
                    images={auctionImages.slice(0, 4)}
                    onImageClick={openGallery}
                    openText={text.open}
                    lines={
                      auctionReport
                        ? [
                            `${text.photos}: ${auctionReport.media?.thumbs_count ?? 0}`,
                            `${text.video}: ${auctionReport.media?.has_video ? text.yes : text.no}`,
                            `360: ${auctionReport.media?.has_360 ? text.yes : text.no}`,
                          ]
                        : [
                            "Снимки преди ремонт",
                            "Източник на снимките",
                            "Дата на обявата",
                            "Снимки на щетите",
                          ]
                    }
                  />

                  <LockedCard
                    title={text.condition}
                    unlocked={Boolean(auctionReport)}
                    lockedText={text.lockedExpert}
                    lines={
                      auctionReport
                        ? [
                            `Has keys: ${formatBoolean(auctionReport.condition?.has_key)}`,
                            `${text.conditionAuction}: ${formatValue(auctionReport.condition?.run_condition?.value, text.noData)}`,
                            `${text.color}: ${formatValue(auctionReport.vehicle_specs?.exterior_color, text.noData)}`,
                            `${text.fuel}: ${formatValue(auctionReport.vehicle_specs?.fuel_type, text.noData)}`,
                            `${text.drive}: ${formatValue(auctionReport.vehicle_specs?.drive_type, text.noData)}`,
                          ]
                        : [
                            "Has keys",
                            "Runs & drives",
                            "Mechanical condition",
                            "Color, ако е наличен",
                          ]
                    }
                  />
                </div>
              </div>

              <div className="lg:sticky lg:top-24">
                <Card className="rounded-3xl bg-white/5">
                  <CardContent className="p-6">
                    <h3 className="mb-5 text-2xl font-black">{text.status}</h3>

                    <div className="space-y-4">
                      <Status
                        icon={<CheckCircle2 />}
                        text={text.vinRecognized}
                      />
                      <Status
                        icon={<Car />}
                        text={`${vehicle.Make} ${vehicle.Model}`}
                      />
                      <Status
                        icon={<Gauge />}
                        text={`${text.year}: ${vehicle.ModelYear}`}
                      />
                      <Status
                        icon={<AlertTriangle />}
                        text={
                          auctionReport
                            ? text.auctionFound
                            : text.auctionNotFound
                        }
                        danger={!auctionReport}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={downloadPdfReport}
                      className="mt-5 w-full rounded-2xl bg-white px-5 py-4 font-black text-slate-950 hover:bg-blue-50"
                    >
                      {text.downloadPdf}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRequestStatus("");
                        setShowRequestForm(true);
                        trackEvent("expert_request_open", {
                          vin,
                          language,
                          has_auction_data: Boolean(auctionReport),
                        });
                      }}
                      className="mt-3 w-full rounded-2xl bg-blue-600 px-5 py-4 font-black text-white hover:bg-blue-700"
                    >
                      {text.requestExpert}
                    </button>
                    <p className="mt-2 text-center text-xs font-bold text-slate-300">
                      {text.requestExpertHint}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {showRequestForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                <div className="w-full max-w-lg rounded-3xl bg-white p-6 text-slate-950 shadow-2xl">
                  <h3 className="text-2xl font-black">{text.requestHeading}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {text.requestText} <strong>{vin}</strong>
                    {text.requestTextSuffix && <>, {text.requestTextSuffix}</>}
                  </p>

                  <div className="mt-5 rounded-2xl bg-slate-100 p-4">
                    <p className="text-sm font-bold text-slate-500">
                      {text.recommendedPrice}
                    </p>
                    <p className="text-4xl font-black">9.99 €</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {text.expertAnalysisPrice}
                    </p>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {text.modalBenefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>

                  <p className="mt-3 text-xs font-bold text-slate-500">
                    {text.modalWarning}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {text.noPaymentYet}
                  </p>

                  <div className="mt-5 grid gap-3">
                    <input
                      value={requestName}
                      onChange={(e) => setRequestName(e.target.value)}
                      placeholder={text.namePlaceholder}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      value={requestContact}
                      onChange={(e) => setRequestContact(e.target.value)}
                      placeholder={text.contactPlaceholder}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {requestStatus === "success" && (
                    <div className="mt-4 rounded-2xl bg-green-100 px-4 py-3 text-sm font-bold text-green-700">
                      {text.requestSuccess}
                    </div>
                  )}

                  {requestStatus === "error" && (
                    <div className="mt-4 rounded-2xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700">
                      {text.requestError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={sendFullReportRequestEmail}
                    disabled={requestLoading}
                    className="mt-5 w-full rounded-2xl bg-blue-600 px-5 py-4 font-black text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {requestLoading
                      ? text.requestSending
                      : `${text.sendRequest} · 9.99 €`}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="mt-3 w-full rounded-2xl bg-slate-200 px-5 py-4 font-black text-slate-700 hover:bg-slate-300"
                  >
                    {text.close}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
        <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-xl font-black text-white">
                  {text.disclaimerTitle}
                </h2>
                <p className="mt-3 leading-7 text-slate-400">
                  {text.disclaimerText}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/50 p-4 text-sm leading-6 text-slate-400 md:max-w-sm">
                <p>• {text.disclaimerPointOne}</p>
                <p>• {text.disclaimerPointTwo}</p>
                <p>• {text.disclaimerPointThree}</p>
              </div>
            </div>
          </div>

          <footer className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-slate-400">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-3 flex items-center gap-3 text-white">
                  <div className="rounded-2xl bg-blue-500 p-2">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-black">VIN Proverka</span>
                </div>
                <p className="text-sm leading-6">{text.footerSourcesText}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    NHTSA
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    Copart
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    IAAI
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    VIN decoder
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-black text-white">
                  {text.footerLinksTitle}
                </h3>
                <div className="mt-3 grid gap-2 text-sm">
                  <a href="#check" className="hover:text-white">
                    {text.footerCheck}
                  </a>
                  <a href="#report" className="hover:text-white">
                    {text.footerReport}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestStatus("");
                      setShowRequestForm(true);
                      trackEvent("expert_request_open", {
                        vin,
                        language,
                        has_auction_data: Boolean(auctionReport),
                        source: "footer",
                      });
                    }}
                    className="text-left hover:text-white"
                  >
                    {text.footerExpert}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-black text-white">
                  {text.footerContactTitle}
                </h3>
                <p className="mt-3 text-sm leading-6">
                  {text.footerContactText}
                </p>
                <a
                  href={`mailto:${text.footerEmail}`}
                  className="mt-3 inline-block font-bold text-blue-200 hover:text-white"
                >
                  {text.footerEmail}
                </a>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 text-xs text-slate-500">
              © {new Date().getFullYear()} VIN Proverka. {text.footerCopyright}
            </div>
          </footer>
        </section>

        {galleryIndex !== null && auctionImages.length > 0 && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <button
              type="button"
              onClick={closeGallery}
              className="absolute inset-0 cursor-default bg-black/90"
              aria-label={text.close}
            />

            <button
              type="button"
              onClick={closeGallery}
              className="absolute right-5 top-5 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label={text.close}
            >
              <X className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <div className="relative z-10 w-full max-w-5xl">
              <img
                src={auctionImages[galleryIndex]}
                alt={`Auction image ${galleryIndex + 1}`}
                className="max-h-[80vh] w-full rounded-3xl object-contain"
              />

              <div className="mt-4 flex items-center justify-between text-sm font-bold text-slate-300">
                <span>
                  {text.galleryImage} {galleryIndex + 1} {text.galleryFrom}{" "}
                  {auctionImages.length}
                </span>
                <span>{text.gallerySource}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function Info({ label, value, fallback = "Няма данни" }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value || fallback}</p>
    </div>
  );
}

function Status({ icon, text, danger = false }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-4 ${
        danger ? "bg-red-500/10 text-red-200" : "bg-slate-900 text-white"
      }`}
    >
      {React.cloneElement(icon, {
        className: danger ? "h-5 w-5 text-red-300" : "h-5 w-5 text-blue-300",
      })}
      <span className="font-bold">{text}</span>
    </div>
  );
}

function LockedCard({
  title,
  lines,
  unlocked = false,
  images = [],
  onImageClick,
  lockedText = "🔒 Налично в експертен анализ",
  openText = "Отвори",
}) {
  return (
    <Card
      className={`relative overflow-hidden rounded-3xl border ${
        unlocked
          ? "border-green-400/20 bg-green-500/5"
          : "border-white/10 bg-white/5"
      }`}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-black">{title}</h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              unlocked
                ? "bg-green-500/15 text-green-200"
                : "bg-blue-500/15 text-blue-200"
            }`}
          >
            {unlocked ? "LIVE" : "PRO"}
          </span>
        </div>

        {images?.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => onImageClick?.(index)}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={src}
                  alt={`${title} ${index + 1}`}
                  className="aspect-video w-full object-cover transition duration-200 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs font-black text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                  {openText}
                </span>
              </button>
            ))}
          </div>
        )}

        <div
          className={`rounded-2xl border border-white/10 bg-slate-950/60 p-4 ${
            unlocked ? "" : "blur-[1px]"
          }`}
        >
          <div className="space-y-3 text-slate-300">
            {lines.map((line) => (
              <p key={line}>• {line}</p>
            ))}
          </div>
        </div>

        {!unlocked && (
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/80 p-3 text-center text-sm font-bold text-white backdrop-blur">
            {lockedText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
