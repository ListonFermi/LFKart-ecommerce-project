module.exports = (date)=> {
  const dateObject = new Date(date);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return dateObject.toLocaleDateString("en-US", options);
};
