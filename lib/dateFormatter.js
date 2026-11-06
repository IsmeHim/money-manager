// Helper to format Date string (YYYY-MM-DD) into Thai Readable Dates
export function formatThaiDate(dateStr, view) {
  if (!dateStr) return "";

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const shortMonthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  if (view === "daily") {
    const [year, month, day] = dateStr.split("-");
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    // Thai year is Christian year + 543
    return `${d.getDate()} ${shortMonthNames[d.getMonth()]} ${d.getFullYear() + 543}`;
  } else if (view === "monthly") {
    const [year, month] = dateStr.split("-");
    return `${monthNames[parseInt(month) - 1]} ${parseInt(year) + 543}`;
  } else if (view === "yearly") {
    return `ปี พ.ศ. ${parseInt(dateStr) + 543}`;
  }
  return dateStr;
}
