import { render } from '@testing-library/react';
import App from './App';
import './plugin/i18n/i18n';

test('renders learn react link', () => {
  render(<App />);
});
