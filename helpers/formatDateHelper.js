module.exports = (date, format='MonDDYYYY') => {
  const dateObject = new Date(date);
  if (format == "MonDDYYYY") {
    var options = { day: "2-digit", month: "short", year: "numeric" };
  } else if (format == "yyyy-MM-dd") {
    var options = { year: "numeric", month: "2-digit", day: "2-digit" };
  } else if( format== "YYYY-MM-DD"){
    return dateObject.toISOString().split('T')[0];
  }

  return dateObject.toLocaleDateString("en-US", options);
};
