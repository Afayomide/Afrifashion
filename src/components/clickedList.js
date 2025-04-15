export function localClickedList(product) {
  const clickedList =
    JSON.parse(localStorage.getItem("localClickedList")) || [];
  const clickedItemId = clickedList.find((item) => item._id === product._id); // Assuming 'id' is unique for each product
  if (clickedItemId) {
  } else {
    const clickedItem = { ...product, newquantity: 1 };
    clickedList.push(clickedItem);
  }
  localStorage.setItem("localClickedList", JSON.stringify(clickedList));
}
