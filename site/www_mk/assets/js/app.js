function increment() {
  const input = $("#amount");
  const current = parseInt(input.val());
  const increment = current + 1;
  input.val(increment);
}

function decrement() {
  const input = $("#amount");
  const current = parseInt(input.val());
  const decrement = current <= 1 ? current : current - 1;
  input.val(decrement);
}