export function enableDrag(containerSelector) {
  const listContainer = document.querySelector(containerSelector);
  
  if (!listContainer) {
    console.error(`Element not found for selector: ${containerSelector}`);
    return;
  }

  let isDown = false;
  let startX;
  let scrollLeft;

  listContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    listContainer.classList.add('active');
    startX = e.pageX - listContainer.offsetLeft;
    scrollLeft = listContainer.scrollLeft;
  });

  listContainer.addEventListener('mouseleave', () => {
    isDown = false;
    listContainer.classList.remove('active');
  });

  listContainer.addEventListener('mouseup', () => {
    isDown = false;
    listContainer.classList.remove('active');
  });

  listContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - listContainer.offsetLeft;
    const walk = (x - startX); // Multiply by a number to increase or decrease scrolling speed
    listContainer.scrollLeft = scrollLeft - walk;
  });

  listContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scrollAmount = e.deltaY > 0 ? 100 : -100; // Adjust scroll amount as needed
    listContainer.scrollLeft += scrollAmount;
  });
}
