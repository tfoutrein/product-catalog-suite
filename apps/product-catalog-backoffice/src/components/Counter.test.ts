import { render, fireEvent } from '@testing-library/svelte';
import Counter from './Counter.svelte';
import '@testing-library/jest-dom';

test('increments count on click', async () => {
  const { getByText } = render(Counter);
  const button = getByText('0');
  await fireEvent.click(button);
  expect(button).toHaveTextContent('1');
});
