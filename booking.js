const ROOM_RATES = {
  Standard: 2500,
  Deluxe: 3000,
  Premier: 5000,
  Family: 6000,
  Suite: 10000,
};
const PLATFORM_FEE_RATE = 0.12;
const VAT_RATE = 0.12;

const money = (value) =>
  "₱" +
  Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function parseNumber(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function calculateRooms() {
  let subtotal = 0;

  $("#roomBody tr").each(function () {
    const row = $(this);
    const roomType = row.find(".roomType").val();
    const quantity = Math.max(1, parseNumber(row.find(".qty").val()));
    const nights = Math.max(1, parseNumber(row.find(".nights").val()));
    const rate = ROOM_RATES[roomType] || 0;
    const lineTotal = rate * quantity * nights;

    row.find(".rateDisplay").text(money(rate));
    row.find(".subtotal").text(money(lineTotal));
    subtotal += lineTotal;
  });

  return subtotal;
}

function calculateOverrides(baseAmount) {
  let total = 0;

  $(".overrideEnabled:checked").each(function () {
    const row = $(this).closest("tr");
    const type = row.find(".overrideType").val();
    const value = parseNumber(row.find(".overrideValue").val());

    if (type === "+fixed") {
      total += value;
    } else if (type === "-fixed") {
      total -= value;
    } else if (type === "+percent") {
      total += baseAmount * (value / 100);
    } else if (type === "-percent") {
      total -= baseAmount * (value / 100);
    } else if (type === "replace") {
      total += value - baseAmount;
    }
  });

  return total;
}

function calculatePromotions(baseAmount) {
  let discount = 0;

  $(".promoEnabled:checked").each(function () {
    const row = $(this).closest("tr");
    const type = row.find(".promoType").val();
    const value = parseNumber(row.find(".promoValue").val());

    if (type === "-percent") {
      discount += baseAmount * (value / 100);
    } else if (type === "-fixed") {
      discount += value;
    } else if (type === "free-night") {
      discount += value;
    } else if (type === "cashback") {
      discount += value;
    }
  });

  return Math.min(baseAmount, discount);
}

function calculateBooking() {
  const roomSubtotal = calculateRooms();
  const overrideAmount = calculateOverrides(roomSubtotal);
  const bookingAfterOverrides = roomSubtotal + overrideAmount;
  const promotionDiscount = calculatePromotions(bookingAfterOverrides);
  const addonAmount =
    parseNumber($("#addonAirport").val()) +
    parseNumber($("#addonBreakfast").val()) +
    parseNumber($("#addonLunch").val()) +
    parseNumber($("#addonDinner").val());

  $("#addonTotal").val(addonAmount.toFixed(2));

  const subtotal =
    Math.max(0, bookingAfterOverrides - promotionDiscount) + addonAmount;
  const vatMode = $(".vatMode:checked").val();
  const creatorPromoEnabled = $("#creatorPromo").is(":checked");
  const platformFeeBase = vatMode === "inclusive" ? subtotal / 1.12 : subtotal;
  const creatorReward = creatorPromoEnabled ? platformFeeBase * 0.02 : 0;
  const guestCashback = creatorReward;

  let vatAmount = 0;
  let commissionBase = subtotal;
  let guestPayable = subtotal;

  if (vatMode === "inclusive") {
    vatAmount = subtotal - subtotal / 1.12;
    commissionBase = subtotal / 1.12;
    guestPayable = subtotal;
  } else if (vatMode === "exclusive") {
    vatAmount = subtotal * VAT_RATE;
    commissionBase = subtotal;
    guestPayable = subtotal + vatAmount;
  }

  const platformFeeRate = creatorPromoEnabled ? 0.08 : PLATFORM_FEE_RATE;
  const platformFee = platformFeeBase * platformFeeRate;

  if (creatorPromoEnabled) {
    guestPayable = Math.max(0, guestPayable - guestCashback);
  }

  const bomoRevenue = platformFee;

  const partnerReceivable = creatorPromoEnabled
    ? Math.max(0, guestPayable - platformFee - creatorReward)
    : Math.max(0, commissionBase + vatAmount - platformFee);
  const paymentGatewayRate = parseNumber($("#paymentGatewayFee").val()) || 0;
  const paymentGatewayFee = guestPayable * (paymentGatewayRate / 100);
  const finalGuestCharge = guestPayable + paymentGatewayFee;

  $("#subtotal").text(money(roomSubtotal));
  $("#overrideAmount").text(money(overrideAmount));
  $("#promotionAmount").text("-" + money(promotionDiscount));
  $("#addonAmount").text(money(addonAmount));
  $("#netBooking").text(money(subtotal));
  $("#vatAmount").text(money(vatAmount));
  $("#platformFeeBase").text(money(platformFeeBase));
  $("#platformAmount").text(money(platformFee));
  $("#paymentGatewayAmount").text(money(paymentGatewayFee));
  $("#grossCheckout").text(money(guestPayable));
  $("#grandTotal, #guestPayable").text(money(finalGuestCharge));
  $("#partnerReceivable").text(money(partnerReceivable));
  $("#bomoRevenue").text(money(bomoRevenue));
  $("#creatorReward").text(money(creatorReward));
  $("#guestCashback").text(money(guestCashback));
  $("#gatewayReceivable").text(money(paymentGatewayFee));
}

$(function () {
  $(document).on("input change", "input, select", calculateBooking);

  $("#addRoom").on("click", function () {
    $("#roomBody").append($("#roomTemplate").html());
    calculateBooking();
  });

  $(document).on("click", ".removeRoom", function () {
    if ($("#roomBody tr").length > 1) {
      $(this).closest("tr").remove();
    }
    calculateBooking();
  });

  $("#addOverride").on("click", function () {
    $("#overrideBody").append($("#overrideTemplate").html());
    calculateBooking();
  });

  $(document).on("click", ".removeOverride", function () {
    $(this).closest("tr").remove();
    calculateBooking();
  });

  $("#addPromotion").on("click", function () {
    $("#promotionBody").append($("#promotionTemplate").html());
    calculateBooking();
  });

  $(document).on("click", ".removePromotion", function () {
    $(this).closest("tr").remove();
    calculateBooking();
  });

  calculateBooking();
});
